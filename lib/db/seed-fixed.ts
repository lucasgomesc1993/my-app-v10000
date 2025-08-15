import { db } from "./index";import * as schema from "./schema";
import { users, banks, categories, accounts, transactions, recurringTransactions, budgets, creditCards, invoices } from "./schema";
import { sql, eq } from "drizzle-orm";

// Função para verificar se as tabelas existem
// Interface para tipar os dados do usuário
interface UserData {
  id: number;
  email: string;
  name: string;
  password: string;
  cpf: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  language: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function checkTablesExist(): Promise<boolean> {
  try {
    // Verifica se a tabela de usuários existe
    await db.select().from(schema.users).limit(1);
    await db.select().from(users).limit(1);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Erro ao verificar tabelas:", error.message);
    } else {
      console.error("❌ Erro desconhecido ao verificar tabelas");
    }
    return false;
  }
}

// Função para limpar uma tabela se ela existir
async function clearTableIfExists(tableName: string, table: any) {
  try {
    console.log(`🧹 Limpando tabela ${tableName}...`);
    await db.delete(table);
    console.log(`✅ Tabela ${tableName} limpa com sucesso!`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ Erro ao limpar tabela ${tableName}:`, error.message);
    } else {
      console.error(`❌ Erro desconhecido ao limpar tabela ${tableName}`);
    }
  }
}

// Função principal do seed
async function seedDatabase() {
  try {
    console.log("🚀 Iniciando seed do banco de dados...");

    // Verificar se as tabelas existem
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.error("❌ As tabelas não existem. Execute as migrations primeiro.");
      process.exit(1);
    }

    // Limpar dados existentes na ordem correta (para evitar restrições de chave estrangeira)
    console.log("🧹 Limpando dados existentes...");
    await clearTableIfExists('invoices', schema.invoices);
    await clearTableIfExists('invoices', invoices);
    await clearTableIfExists('credit_cards', creditCards);
    await clearTableIfExists('recurring_transactions', recurringTransactions);
    await clearTableIfExists('transactions', transactions);
    await clearTableIfExists('budgets', budgets);
    await clearTableIfExists('accounts', accounts);
    await clearTableIfExists('categories', categories);
    await clearTableIfExists('banks', banks);
    await clearTableIfExists('users', users);
    // Inserir usuário de exemplo
    console.log("👤 Inserindo usuário de exemplo...");
    const hashedPassword = await bcrypt.hash("senha123", 10);
    
    const userData = {
      email: "usuario@exemplo.com",
      password: hashedPassword,
      name: "Usuário de Teste",
      cpf: "123.456.789-00",
      phone: "(11) 98765-4321",
      address: "Rua Exemplo, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      country: "BR",
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      dateFormat: "DD/MM/YYYY",
      language: "pt-BR",
      isActive: true,
    };

    const [user] = await db.insert(schema.users).values(userData).returning();
    const [user] = await db.insert(users).values(userData).returning();

    // Inserir bancos de exemplo
    console.log("🏦 Inserindo bancos de exemplo...");
    const banksData = [
      { name: "Nubank", code: "260", color: "#8A05BE" },
      { name: "Itaú", code: "341", color: "#EC7000" },
      { name: "Bradesco", code: "237", color: "#CC092F" },
      { name: "Banco do Brasil", code: "001", color: "FFD100" },
      { name: "Santander", code: "033", color: "#EC0000" },
    ];

    const insertedBanks = await db.insert(schema.banks).values(banksData).returning();
    const insertedBanks = await db.insert(banks).values(banksData).returning();

    // Inserir categorias de exemplo
    console.log("📂 Inserindo categorias de exemplo...");
    const categoriesData = [
      { name: "Alimentação", color: "#10B981", icon: "utensils", type: "despesa" as const, userId: user.id },
      { name: "Alimentação", color: "#10B981", icon: "utensils" },
      { name: "Transporte", color: "#3B82F6", icon: "bus" },
      { name: "Moradia", color: "#8B5CF6", icon: "home" },
      { name: "Saúde", color: "#EC4899", icon: "heart-pulse" },
      { name: "Educação", color: "#6366F1", icon: "graduation-cap" },
      { name: "Lazer", color: "#F59E0B", icon: "film" },
      { name: "Compras", color: "#8B5CF6", icon: "shopping-bag" },
      { name: "Salário", color: "#10B981", icon: "dollar-sign", isIncome: true },
      { name: "Investimentos", color: "#06B6D4", icon: "trending-up", isIncome: true },

    const insertedCategories = await db.insert(schema.categories).values(categoriesData).returning();
    const insertedCategories = await db.insert(categories).values(categoriesData).returning();

    // Inserir contas de exemplo
    console.log("💳 Inserindo contas de exemplo...");
    const foodCategory = insertedCategories.find((c) => c.name === "Alimentação");
    const salaryCategory = insertedCategories.find((c) => c.name === "Salário");

    const accountsData = [
      {
        userId: user.id,
        bankId: insertedBanks[0].id,
        name: "Conta Corrente Nubank",
        name: "Conta Corrente",
        type: "checking" as const,
        balance: 5000.0,
        isFavorite: true,
        isDefault: true,
      {
        userId: user.id,
        bankId: insertedBanks[1].id,
        name: "Conta Poupança Itaú",
        name: "Conta Poupança",
        type: "savings" as const,
        balance: 10000.0,
        isFavorite: false,
        isDefault: false,
    ];

    const insertedAccounts = await db.insert(schema.accounts).values(accountsData).returning();
    const insertedAccounts = await db.insert(accounts).values(accountsData).returning();

    // Inserir cartões de crédito de exemplo
    console.log("💳 Inserindo cartões de crédito de exemplo...");
    const creditCardsData = [
      {
        userId: user.id,
        name: "Cartão Nubank",
        brand: "mastercard",
        brand: "mastercard" as const,
        type: "credito" as const,
        limit: 5000.00,
        creditLimit: 5000.00,
        currentBalance: 1320.45,
        availableLimit: 3679.55,
        dueDay: 15,
        color: "#8A05BE",
        isFavorite: true,
        isActive: true,
        notes: "Cartão principal"
      },
      {
        userId: user.id,
        name: "Cartão Inter",
        brand: "visa",
        brand: "visa" as const,
        type: "credito" as const,
        limit: 3000.00,
        creditLimit: 3000.00,
        currentBalance: 0.00,
        availableLimit: 3000.00,
        dueDay: 20,
        color: "#FF7A00",
        isFavorite: false,
        isActive: true,
        notes: "Cartão para emergências"
      }
    ];

    const insertedCreditCards = await db.insert(schema.creditCards).values(creditCardsData).returning();
    const insertedCreditCards = await db.insert(creditCards).values(creditCardsData).returning();

    // Inserir faturas de exemplo
    console.log("📅 Inserindo faturas de exemplo...");
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const invoicesData = [
      {
        creditCardId: insertedCreditCards[0].id,
        month: currentMonth + 1, // getMonth() retorna 0-11
        year: currentYear,
        amount: 1320.45,
        dueDate: new Date(currentYear, currentMonth, 15).toISOString(), // Dia 15 do mês atual
        dueDate: new Date(currentYear, currentMonth, 15), // Dia 15 do mês atual
      },
      {
        creditCardId: insertedCreditCards[0].id,
        month: currentMonth === 0 ? 12 : currentMonth, // Mês anterior
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        amount: 980.75,
        dueDate: new Date(currentYear, currentMonth - 1, 15).toISOString(),
        dueDate: new Date(currentYear, currentMonth - 1, 15),
        paidAt: new Date(currentYear, currentMonth - 1, 10).toISOString(),
        paidAt: new Date(currentYear, currentMonth - 1, 10),
    ];

    const insertedInvoices = await db.insert(schema.invoices).values(invoicesData).returning();
    const insertedInvoices = await db.insert(invoices).values(invoicesData).returning();

    console.log("\n✨ Seed concluído com sucesso! ✨");
    console.log("📊 Resumo:");
    console.log(`- ${insertedBanks.length} bancos`);
    console.log(`- ${insertedCategories.length} categorias`);
    console.log(`- ${insertedAccounts.length} contas`);
    console.log(`- ${insertedCreditCards.length} cartões de crédito`);
    console.log(`- ${insertedInvoices.length} faturas`);
    console.log("\nAcesse o sistema com as seguintes credenciais:");
    console.log(`📧 Email: ${userData.email}`);
    console.log(`🔑 Senha: senha123`);

    process.exit(0);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Erro durante o seed:", error.message);
      console.error(error.stack);
    } else {
      console.error("❌ Erro desconhecido durante o seed");
    }
    process.exit(1);
  }
}

// Executar o seed
seedDatabase();
