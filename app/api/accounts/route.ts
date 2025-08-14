import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accounts, banks } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const userId = 1; // TODO: Pegar do contexto de autenticação

    const accountsWithBanks = await db
      .select({
        id: accounts.id,
        name: accounts.name,
        bank: accounts.bank,
        bankName: banks.name,
        type: accounts.type,
        balance: accounts.balance,
        initialBalance: accounts.initialBalance,
        color: accounts.color,
        isFavorite: accounts.isFavorite,
        isActive: accounts.isActive,
        description: accounts.description,
        createdAt: accounts.createdAt,
        updatedAt: accounts.updatedAt,
      })
      .from(accounts)
      .leftJoin(banks, eq(accounts.bankId, banks.id))
      .where(eq(accounts.userId, userId))
      .orderBy(desc(accounts.isFavorite), desc(accounts.createdAt));

    return NextResponse.json({
      accounts: accountsWithBanks,
      total: accountsWithBanks.length,
    });
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
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

    const { nome, tipo, bancoId, agencia, conta, saldoInicial } = body;

    // Validações básicas
    if (!nome || !tipo) {
      return NextResponse.json(
        { error: "Nome e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar informações do banco se bancoId foi fornecido
    let bankInfo = null;
    if (bancoId) {
      const bank = await db
        .select()
        .from(banks)
        .where(eq(banks.id, parseInt(bancoId)))
        .limit(1);
      
      if (bank.length > 0) {
        bankInfo = bank[0];
      }
    }

    const newAccount = await db
      .insert(accounts)
      .values({
        userId,
        name: nome,
        bank: bankInfo?.name || "Banco não informado",
        bankId: bancoId ? parseInt(bancoId) : null,
        type: tipo,
        balance: saldoInicial || 0,
        initialBalance: saldoInicial || 0,
        color: "#3b82f6", // Cor padrão
        isFavorite: false,
        isActive: true,
        description: `Conta ${tipo}`,
        bankCode: bankInfo?.code || null,
        accountId: conta || null,
        agency: agencia || null,
      })
      .returning();

    return NextResponse.json(newAccount[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
