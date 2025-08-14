import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accounts, transactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = parseInt(params.id);

    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: "ID de conta inválido" },
        { status: 400 }
      );
    }

    // Verificar se a conta existe
    const existingAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    if (existingAccount.length === 0) {
      return NextResponse.json(
        { error: "Conta não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se há transações associadas
    const relatedTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.accountId, accountId))
      .limit(1);

    if (relatedTransactions.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir conta com transações associadas" },
        { status: 400 }
      );
    }

    // Deletar a conta
    await db
      .delete(accounts)
      .where(eq(accounts.id, accountId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = parseInt(params.id);
    
    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: "ID de conta inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nome, tipo, bancoId, agencia, conta, saldoInicial } = body;

    // Verificar se a conta existe
    const existingAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    if (existingAccount.length === 0) {
      return NextResponse.json(
        { error: "Conta não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar a conta
    const updatedAccount = await db
      .update(accounts)
      .set({
        name: nome,
        type: tipo,
        bankId: bancoId,
        agency: agencia,
        accountNumber: conta,
        balance: saldoInicial || existingAccount[0].balance,
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, accountId))
      .returning();

    return NextResponse.json(updatedAccount[0]);
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
