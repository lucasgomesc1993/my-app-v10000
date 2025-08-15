import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;
    
    // Contar transações que usam esta categoria
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(eq(transactions.categoryId, parseInt(categoryId)));

    return NextResponse.json({ count: result?.count || 0 });
  } catch (error) {
    console.error("Erro ao contar transações:", error);
    return NextResponse.json(
      { error: "Erro ao contar transações" },
      { status: 500 }
    );
  }
}
