import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creditCards } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const userId = 1; // TODO: Pegar do contexto de autenticação

    const cards = await db
      .select()
      .from(creditCards)
      .where(eq(creditCards.userId, userId))
      .orderBy(desc(creditCards.isFavorite), desc(creditCards.createdAt));

    return NextResponse.json({
      cards,
      total: cards.length,
    });
  } catch (error) {
    console.error("Erro ao buscar cartões:", error);
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

    const { name, brand, type, lastFourDigits, creditLimit, closingDay, dueDay, color, notes } = body;

    // Validações básicas
    if (!name || !brand || !type || !lastFourDigits || !closingDay || !dueDay) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    if (closingDay < 1 || closingDay > 31 || dueDay < 1 || dueDay > 31) {
      return NextResponse.json(
        { error: "Dias de fechamento e vencimento devem estar entre 1 e 31" },
        { status: 400 }
      );
    }

    // Calcular limite disponível
    const availableLimit = creditLimit || 0;

    const newCard = await db
      .insert(creditCards)
      .values({
        userId,
        name,
        brand,
        type,
        lastFourDigits,
        creditLimit: creditLimit || 0,
        currentBalance: 0,
        availableLimit,
        closingDay,
        dueDay,
        color: color || "#3b82f6",
        notes,
      })
      .returning();

    return NextResponse.json(newCard[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cartão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
