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

    // Mapear os campos do formulário para o formato esperado
    const nomeConta = body.nome || body.name;
    const tipoConta = body.tipo === 'poupança' ? 'poupança' : 
                     body.tipo === 'investimento' ? 'investimento' : 'corrente';
    const nomeBanco = body.banco || body.bank || 'Banco não informado';
    const saldo = body.saldo || body.saldoInicial || 0;
    const corConta = body.cor || '#3b82f6';
    
    console.log('Dados processados na API:', { nomeConta, tipoConta, nomeBanco, saldo, corConta });

    // Validações básicas
    if (!nomeConta) {
      console.error('Validação falhou: nome da conta ausente', body);
      return NextResponse.json(
        { error: "O nome da conta é obrigatório" },
        { status: 400 }
      );
    }

    // Criar um objeto com os valores
    const accountData: any = {
      userId,
      name: nomeConta,
      bank: nomeBanco,
      type: tipoConta,
      balance: Number(saldo) || 0,
      initialBalance: Number(saldo) || 0,
      color: corConta,
      isFavorite: false,
      isActive: true,
      description: `Conta ${tipoConta}`,
      accountNumber: body.conta || '',
      agency: body.agencia || '',
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
