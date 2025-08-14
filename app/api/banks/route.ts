import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { banks } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    const allBanks = await db.select().from(banks);

    return NextResponse.json({
      banks: allBanks,
      total: allBanks.length,
    });
  } catch (error) {
    console.error("Erro ao buscar bancos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
