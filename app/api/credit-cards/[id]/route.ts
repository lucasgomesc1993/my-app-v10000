import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creditCards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cardId = parseInt(params.id);
    const userId = 1; // TODO: Pegar do contexto de autenticação

    if (isNaN(cardId)) {
      return NextResponse.json(
        { error: "ID de cartão inválido" },
        { status: 400 }
      );
    }

    const card = await db
      .select()
      .from(creditCards)
      .where(eq(creditCards.id, cardId))
      .limit(1);

    if (card.length === 0) {
      return NextResponse.json(
        { error: "Cartão não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o cartão pertence ao usuário
    if (card[0].userId !== userId) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    return NextResponse.json(card[0]);
  } catch (error) {
    console.error("Erro ao buscar cartão:", error);
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
    const cardId = parseInt(params.id);
    const userId = 1; // TODO: Pegar do contexto de autenticação
    const body = await request.json();

    if (isNaN(cardId)) {
      return NextResponse.json(
        { error: "ID de cartão inválido" },
        { status: 400 }
      );
    }

    // Verificar se o cartão existe e pertence ao usuário
    const existingCard = await db
      .select()
      .from(creditCards)
      .where(eq(creditCards.id, cardId))
      .limit(1);

    if (existingCard.length === 0) {
      return NextResponse.json(
        { error: "Cartão não encontrado" },
        { status: 404 }
      );
    }

    if (existingCard[0].userId !== userId) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const { name, creditLimit, closingDay, dueDay, color, notes, isFavorite } = body;

    // Validações
    if (closingDay && (closingDay < 1 || closingDay > 31)) {
      return NextResponse.json(
        { error: "Dia de fechamento deve estar entre 1 e 31" },
        { status: 400 }
      );
    }

    if (dueDay && (dueDay < 1 || dueDay > 31)) {
      return NextResponse.json(
        { error: "Dia de vencimento deve estar entre 1 e 31" },
        { status: 400 }
      );
    }

    // Se está marcando como favorito, desmarcar outros
    if (isFavorite) {
      await db
        .update(creditCards)
        .set({ isFavorite: false })
        .where(eq(creditCards.userId, userId));
    }

    // Calcular novo limite disponível se o limite foi alterado
    const newCreditLimit = creditLimit !== undefined ? creditLimit : existingCard[0].creditLimit;
    const availableLimit = newCreditLimit - existingCard[0].currentBalance;

    const updatedCard = await db
      .update(creditCards)
      .set({
        name: name !== undefined ? name : existingCard[0].name,
        creditLimit: newCreditLimit,
        availableLimit,
        closingDay: closingDay !== undefined ? closingDay : existingCard[0].closingDay,
        dueDay: dueDay !== undefined ? dueDay : existingCard[0].dueDay,
        color: color !== undefined ? color : existingCard[0].color,
        notes: notes !== undefined ? notes : existingCard[0].notes,
        isFavorite: isFavorite !== undefined ? isFavorite : existingCard[0].isFavorite,
        updatedAt: new Date(),
      })
      .where(eq(creditCards.id, cardId))
      .returning();

    return NextResponse.json(updatedCard[0]);
  } catch (error) {
    console.error("Erro ao atualizar cartão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cardId = parseInt(params.id);
    const userId = 1; // TODO: Pegar do contexto de autenticação

    if (isNaN(cardId)) {
      return NextResponse.json(
        { error: "ID de cartão inválido" },
        { status: 400 }
      );
    }

    // Verificar se o cartão existe e pertence ao usuário
    const existingCard = await db
      .select()
      .from(creditCards)
      .where(eq(creditCards.id, cardId))
      .limit(1);

    if (existingCard.length === 0) {
      return NextResponse.json(
        { error: "Cartão não encontrado" },
        { status: 404 }
      );
    }

    if (existingCard[0].userId !== userId) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Verificar se há faturas associadas (opcional - pode permitir exclusão)
    // TODO: Implementar verificação se necessário

    await db
      .delete(creditCards)
      .where(eq(creditCards.id, cardId));

    return NextResponse.json({ message: "Cartão excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir cartão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
