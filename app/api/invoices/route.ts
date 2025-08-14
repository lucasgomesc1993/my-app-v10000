import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invoices, creditCards } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const userId = 1; // TODO: Pegar do contexto de autenticação
    const { searchParams } = new URL(request.url);
    const creditCardId = searchParams.get('creditCardId');

    let query = db
      .select({
        id: invoices.id,
        creditCardId: invoices.creditCardId,
        cardName: invoices.cardName,
        amount: invoices.amount,
        minimumAmount: invoices.minimumAmount,
        previousBalance: invoices.previousBalance,
        newBalance: invoices.newBalance,
        creditLimit: invoices.creditLimit,
        availableCredit: invoices.availableCredit,
        dueDate: invoices.dueDate,
        closingDate: invoices.closingDate,
        periodStart: invoices.periodStart,
        periodEnd: invoices.periodEnd,
        status: invoices.status,
        isPaid: invoices.isPaid,
        paidAt: invoices.paidAt,
        paidAmount: invoices.paidAmount,
        paidAccountId: invoices.paidAccountId,
        notes: invoices.notes,
        createdAt: invoices.createdAt,
        updatedAt: invoices.updatedAt,
      })
      .from(invoices)
      .where(eq(invoices.userId, userId));

    if (creditCardId) {
      query = query.where(and(
        eq(invoices.userId, userId),
        eq(invoices.creditCardId, parseInt(creditCardId))
      ));
    }

    const allInvoices = await query.orderBy(desc(invoices.dueDate));

    return NextResponse.json({
      invoices: allInvoices,
      total: allInvoices.length,
    });
  } catch (error) {
    console.error("Erro ao buscar faturas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = 1; // TODO: Pegar do contexto de autenticação
    const body = await request.json();

    const {
      creditCardId,
      cardName,
      amount,
      minimumAmount,
      previousBalance,
      newBalance,
      creditLimit,
      availableCredit,
      dueDate,
      closingDate,
      periodStart,
      periodEnd,
      notes
    } = body;

    // Validações básicas
    if (!creditCardId || !cardName || !amount || !dueDate || !closingDate) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    // Verificar se o cartão existe e pertence ao usuário
    const card = await db
      .select()
      .from(creditCards)
      .where(and(
        eq(creditCards.id, creditCardId),
        eq(creditCards.userId, userId)
      ))
      .limit(1);

    if (card.length === 0) {
      return NextResponse.json(
        { error: "Cartão não encontrado" },
        { status: 404 }
      );
    }

    const newInvoice = await db
      .insert(invoices)
      .values({
        userId,
        creditCardId,
        cardName,
        amount,
        minimumAmount: minimumAmount || 0,
        previousBalance: previousBalance || 0,
        newBalance: newBalance || amount,
        creditLimit: creditLimit || card[0].creditLimit,
        availableCredit: availableCredit || (card[0].creditLimit - amount),
        dueDate: new Date(dueDate),
        closingDate: new Date(closingDate),
        periodStart: periodStart ? new Date(periodStart) : null,
        periodEnd: periodEnd ? new Date(periodEnd) : null,
        status: "aberta",
        isPaid: false,
        paidAmount: 0,
        notes,
      })
      .returning();

    return NextResponse.json(newInvoice[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar fatura:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
