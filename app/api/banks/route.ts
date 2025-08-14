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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar os dados recebidos
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: "O nome do banco é obrigatório" },
        { status: 400 }
      );
    }

    // Gerar um código único baseado no timestamp
    const code = `999${Date.now().toString().slice(-3)}`;
    
    // Inserir o novo banco no banco de dados
    const [newBank] = await db.insert(banks).values({
      code,
      name: body.name,
      fullName: body.fullName || body.name,
      website: body.website || '',
      ofxUrl: body.ofxUrl || '',
      ofxVersion: body.ofxVersion || '102',
      isActive: body.isActive !== undefined ? body.isActive : true,
    }).returning();

    return NextResponse.json(newBank, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar banco:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao criar banco" },
      { status: 500 }
    );
  }
}
