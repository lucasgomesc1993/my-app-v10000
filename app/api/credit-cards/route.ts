import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creditCards, users } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { sql } from "drizzle-orm";

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
    // Verificar se existe um usuário, se não existir, criar um padrão
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, 1))
      .get();

    let userId = 1;

    if (!existingUser) {
      try {
        // Criar um usuário padrão se não existir
        await db.insert(users).values({
          id: 1,
          email: 'usuario@exemplo.com',
          name: 'Usuário Padrão',
          password: '$2b$10$examplehash', // Senha hash de exemplo
          isActive: true,
          createdAt: sql`(unixepoch())`,
          updatedAt: sql`(unixepoch())`
        });
        console.log('Usuário padrão criado com sucesso');
      } catch (error) {
        console.error('Erro ao criar usuário padrão:', error);
        return NextResponse.json(
          { error: "Erro ao configurar o usuário padrão" },
          { status: 500 }
        );
      }
    }

    const body = await request.json();
    console.log('Dados recebidos na API de cartões:', body);

    const { name, brand, type, lastFourDigits, creditLimit, closingDay, dueDay, color, notes } = body;

    // Validações básicas
    if (!name || !brand || !type || !lastFourDigits || !closingDay || !dueDay) {
      console.error('Validação falhou para cartão:', { name, brand, type, lastFourDigits, closingDay, dueDay });
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
