import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accounts, banks, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

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
    console.log('Dados recebidos na API de contas:', body);

    const { nome, tipo, banco, agencia, conta, saldoInicial } = body;

    // Validações básicas
    if (!nome || !tipo) {
      console.error('Validação falhou: nome ou tipo ausente', { nome, tipo });
      return NextResponse.json(
        { error: "Nome e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar um objeto com os valores padrão
    const accountData: any = {
      userId,
      name: nome,
      bank: banco || "Banco não informado",
      type: tipo,
      balance: saldoInicial ? Number(saldoInicial) : 0,
      initialBalance: saldoInicial ? Number(saldoInicial) : 0,
      color: "#3b82f6", // Cor padrão
      isFavorite: false,
      isActive: true,
      description: `Conta ${tipo}`,
      accountId: conta || null,
      agency: agencia || null,
    };

    // Inserir a conta no banco de dados
    const newAccount = await db
      .insert(accounts)
      .values(accountData)
      .returning();

    console.log('Conta criada com sucesso:', newAccount[0]);
    return NextResponse.json(newAccount[0], { status: 201 });
  } catch (error) {
    console.error("Erro detalhado ao criar conta:", {
      error: error,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
