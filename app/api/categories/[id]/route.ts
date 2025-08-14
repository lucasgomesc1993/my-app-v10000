import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // Verificar se a categoria existe
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Deletar a categoria
    await db
      .delete(categories)
      .where(eq(categories.id, categoryId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
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
    const categoryId = params.id;
    const body = await request.json();
    const { nome, tipo, cor, icone, descricao } = body;

    // Verificar se a categoria existe
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar a categoria
    const updatedCategory = await db
      .update(categories)
      .set({
        name: nome,
        type: tipo,
        color: cor,
        icon: icone,
        description: descricao,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
