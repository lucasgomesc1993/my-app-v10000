import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invoices, transactions, accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = parseInt(params.id);
    const userId = 1; // TODO: Pegar do contexto de autenticação
    const body = await request.json();

    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { error: "ID de fatura inválido" },
        { status: 400 }
      );
    }

    const { accountId, amount, description, paymentDate } = body;

    // Validações básicas
    if (!accountId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Conta e valor são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se a fatura existe e pertence ao usuário
    const invoice = await db
      .select()
      .from(invoices)
      .where(and(
        eq(invoices.id, invoiceId),
        eq(invoices.userId, userId)
      ))
      .limit(1);

    if (invoice.length === 0) {
      return NextResponse.json(
        { error: "Fatura não encontrada" },
        { status: 404 }
      );
    }

    if (invoice[0].isPaid) {
      return NextResponse.json(
        { error: "Fatura já foi paga" },
        { status: 400 }
      );
    }

    // Verificar se a conta existe e pertence ao usuário
    const account = await db
      .select()
      .from(accounts)
      .where(and(
        eq(accounts.id, accountId),
        eq(accounts.userId, userId)
      ))
      .limit(1);

    if (account.length === 0) {
      return NextResponse.json(
        { error: "Conta não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se há saldo suficiente
    if (account[0].balance < amount) {
      return NextResponse.json(
        { error: "Saldo insuficiente na conta" },
        { status: 400 }
      );
    }

    const transactionDate = paymentDate ? new Date(paymentDate) : new Date();

    // Iniciar transação do banco de dados
    await db.transaction(async (tx) => {
      // 1. Criar transação de pagamento de fatura com tipo 'bill_payment'
      await tx.insert(transactions).values({
        userId,
        type: "bill_payment", // Tipo correto para pagamento de fatura
        description: description || `Pagamento fatura ${invoice[0].cardName}`,
        amount,
        accountId,
        categoryId: null, // Pagamentos de fatura não precisam de categoria
        date: transactionDate,
        status: "completed",
        tags: JSON.stringify(["fatura", "pagamento"]),
        metadata: JSON.stringify({
          invoiceId: invoice[0].id,
          cardName: invoice[0].cardName,
          paymentType: "bill_payment"
        }),
      });

      // 2. Atualizar saldo da conta (debitar)
      await tx
        .update(accounts)
        .set({
          balance: account[0].balance - amount,
          updatedAt: new Date(),
        })
        .where(eq(accounts.id, accountId));

      // 3. Atualizar status da fatura
      const isPaidInFull = amount >= invoice[0].amount;
      const newStatus = isPaidInFull ? "paga" : "aberta";
      
      await tx
        .update(invoices)
        .set({
          isPaid: isPaidInFull,
          paidAmount: (invoice[0].paidAmount || 0) + amount,
          paidAt: isPaidInFull ? transactionDate : invoice[0].paidAt,
          paidAccountId: accountId,
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, invoiceId));
    });

    // Buscar fatura atualizada
    const updatedInvoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, invoiceId))
      .limit(1);

    return NextResponse.json({
      message: "Pagamento realizado com sucesso",
      invoice: updatedInvoice[0],
      transactionType: "bill_payment"
    });

  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
