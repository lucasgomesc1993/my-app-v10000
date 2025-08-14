import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, users } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Verificar se existe um usuário, se não existir, criar um padrão
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, 1))
      .get();

    const userId = 1;

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

    // Buscar categorias do usuário
    const userCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(desc(categories.createdAt));

    return NextResponse.json({
      categories: userCategories,
      total: userCategories.length,
    });
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
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

    const userId = 1;

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
    console.log('Dados recebidos na API de categorias:', body);

    const { nome, tipo, cor, icone, descricao } = body;

    // Validações básicas
    if (!nome || !tipo || !cor || !icone) {
      console.error('Validação falhou: campos obrigatórios ausentes', { nome, tipo, cor, icone });
      return NextResponse.json(
        { error: "Nome, tipo, cor e ícone são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se já existe uma categoria com o mesmo nome para o usuário
    const existingCategory = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.userId, userId),
          eq(categories.name, nome)
        )
      )
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      );
    }

    // Criar a categoria
    const newCategory = await db
      .insert(categories)
      .values({
        userId,
        name: nome,
        type: tipo,
        color: cor,
        icon: icone,
        description: descricao || null,
        isActive: true,
      })
      .returning();

    console.log('Categoria criada com sucesso:', newCategory[0]);
    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
