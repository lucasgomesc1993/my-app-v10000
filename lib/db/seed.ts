import { db } from "./index";
import { users, banks, categories, accounts, transactions, recurringTransactions, budgets, creditCards, invoices } from "./schema";

export async function seedDatabase() {
  try {
    console.log("🚀 Iniciando seed do banco de dados...");

    // Criar usuário teste
    const testUser = await db
      .insert(users)
      .values({
        email: "teste@teste.com",
        password: "teste",
        name: "Usuário Teste",
        avatar: null,
        cpf: "123.456.789-00",
        phone: "(11) 99999-9999",
        address: "Rua Teste, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
        country: "BR",
        timezone: "America/Sao_Paulo",
        currency: "BRL",
        dateFormat: "DD/MM/YYYY",
        language: "pt-BR",
        isActive: true,
      })
      .returning();

    const userId = testUser[0].id;

    // Criar bancos padrão (principais bancos brasileiros)
    const defaultBanks = [
      { code: "001", name: "Banco do Brasil", fullName: "Banco do Brasil S.A.", website: "https://bb.com.br" },
      { code: "104", name: "Caixa Econômica", fullName: "Caixa Econômica Federal", website: "https://caixa.gov.br" },
      { code: "237", name: "Bradesco", fullName: "Banco Bradesco S.A.", website: "https://bradesco.com.br" },
      { code: "341", name: "Itaú", fullName: "Itaú Unibanco S.A.", website: "https://itau.com.br" },
      { code: "033", name: "Santander", fullName: "Banco Santander Brasil S.A.", website: "https://santander.com.br" },
      { code: "260", name: "Nu Pagamentos", fullName: "Nu Pagamentos S.A.", website: "https://nubank.com.br" },
      { code: "077", name: "Inter", fullName: "Banco Inter S.A.", website: "https://bancointer.com.br" },
      { code: "212", name: "Original", fullName: "Banco Original S.A.", website: "https://original.com.br" },
    ];

    const createdBanks = await db
      .insert(banks)
      .values(defaultBanks)
      .returning();

    // Criar categorias padrão com dados completos
    const defaultCategories = [
      { 
        name: "Salário", 
        type: "receita" as const, 
        color: "green", 
        icon: "DollarSign",
        description: "Salário mensal e benefícios trabalhistas",
        ofxCategory: "SALARY",
        taxDeductible: false
      },
      { 
        name: "Freelance", 
        type: "receita" as const, 
        color: "blue", 
        icon: "Briefcase",
        description: "Trabalhos freelance e consultoria",
        ofxCategory: "CONSULTING",
        taxDeductible: false
      },
      { 
        name: "Investimentos", 
        type: "receita" as const, 
        color: "purple", 
        icon: "TrendingUp",
        description: "Rendimentos de investimentos",
        ofxCategory: "INVESTMENT",
        taxDeductible: false
      },
      { 
        name: "Alimentação", 
        type: "despesa" as const, 
        color: "orange", 
        icon: "UtensilsCrossed",
        description: "Supermercado, restaurantes e delivery",
        ofxCategory: "FOOD",
        taxDeductible: false
      },
      { 
        name: "Transporte", 
        type: "despesa" as const, 
        color: "red", 
        icon: "Car",
        description: "Combustível, transporte público e manutenção",
        ofxCategory: "TRANSPORT",
        taxDeductible: false
      },
      { 
        name: "Moradia", 
        type: "despesa" as const, 
        color: "purple", 
        icon: "Home",
        description: "Aluguel, financiamento e contas da casa",
        ofxCategory: "HOUSING",
        taxDeductible: false
      },
      { 
        name: "Saúde", 
        type: "despesa" as const, 
        color: "red", 
        icon: "Heart",
        description: "Plano de saúde, medicamentos e consultas",
        ofxCategory: "MEDICAL",
        taxDeductible: true
      },
      { 
        name: "Educação", 
        type: "despesa" as const, 
        color: "blue", 
        icon: "GraduationCap",
        description: "Cursos, livros e material escolar",
        ofxCategory: "EDUCATION",
        taxDeductible: true
      },
      { 
        name: "Lazer", 
        type: "despesa" as const, 
        color: "pink", 
        icon: "Gamepad2",
        description: "Cinema, jogos e entretenimento",
        ofxCategory: "ENTERTAINMENT",
        taxDeductible: false
      },
      { 
        name: "Transferência", 
        type: "transferencia" as const, 
        color: "gray", 
        icon: "ArrowRightLeft",
        description: "Transferências entre contas",
        ofxCategory: "TRANSFER",
        taxDeductible: false
      },
    ];

    const createdCategories = await db
      .insert(categories)
      .values(
        defaultCategories.map(cat => ({
          userId,
          ...cat,
        }))
      )
      .returning();

    // Criar contas padrão com dados completos para OFX
    const defaultAccounts = [
      {
        name: "Conta Corrente BB",
        bank: "Banco do Brasil",
        bankId: createdBanks.find(b => b.code === "001")?.id,
        type: "corrente" as const,
        color: "blue",
        balance: 2500.00,
        initialBalance: 2000.00,
        isFavorite: true,
        agency: "1234",
        agencyDigit: "5",
        accountNumber: "12345",
        accountDigit: "6",
        bankCode: "001",
        branchId: "1234",
        accountId: "001-1234-12345-6",
        ofxAccountType: "CHECKING",
        ofxBankId: "001",
        ofxBranchId: "1234",
        ofxAccountId: "12345",
        description: "Conta corrente principal",
        syncEnabled: true,
      },
      {
        name: "Poupança CEF",
        bank: "Caixa Econômica",
        bankId: createdBanks.find(b => b.code === "104")?.id,
        type: "poupança" as const,
        color: "green",
        balance: 5000.00,
        initialBalance: 4500.00,
        isFavorite: false,
        agency: "0001",
        agencyDigit: "",
        accountNumber: "98765",
        accountDigit: "4",
        bankCode: "104",
        branchId: "0001",
        accountId: "104-0001-98765-4",
        ofxAccountType: "SAVINGS",
        ofxBankId: "104",
        ofxBranchId: "0001",
        ofxAccountId: "98765",
        description: "Conta poupança para reserva de emergência",
        syncEnabled: true,
      },
      {
        name: "Nubank",
        bank: "Nu Pagamentos",
        bankId: createdBanks.find(b => b.code === "260")?.id,
        type: "corrente" as const,
        color: "purple",
        balance: 1200.00,
        initialBalance: 1000.00,
        isFavorite: true,
        bankCode: "260",
        accountId: "260-nubank-001",
        ofxAccountType: "CHECKING",
        ofxBankId: "260",
        ofxAccountId: "nubank-001",
        description: "Conta digital Nubank",
        syncEnabled: false,
      },
      {
        name: "Cartão Itaú",
        bank: "Itaú",
        bankId: createdBanks.find(b => b.code === "341")?.id,
        type: "cartao_credito" as const,
        color: "orange",
        balance: -850.00,
        creditLimit: 5000.00,
        isFavorite: false,
        bankCode: "341",
        accountId: "341-cartao-001",
        ofxAccountType: "CREDITLINE",
        ofxBankId: "341",
        ofxAccountId: "cartao-001",
        description: "Cartão de crédito Itaú",
        syncEnabled: true,
      },
    ];

    const createdAccounts = await db
      .insert(accounts)
      .values(
        defaultAccounts.map(acc => ({
          userId,
          ...acc,
        }))
      )
      .returning();

    // Criar transações de exemplo com dados completos para OFX
    const sampleTransactions = [
      {
        type: "receita" as const,
        description: "Salário Janeiro 2024",
        amount: 4500.00,
        date: new Date("2024-01-05"),
        effectiveDate: new Date("2024-01-05"),
        categoryId: createdCategories.find(c => c.name === "Salário")!.id,
        accountId: createdAccounts.find(a => a.name === "Conta Corrente BB")!.id,
        status: "confirmada" as const,
        isPaid: true,
        fitId: "SAL202401051",
        bankTransactionType: "CREDIT",
        payee: "Empresa XYZ Ltda",
        memo: "Salário ref. Janeiro/2024",
        currency: "BRL",
        importSource: "manual",
        hash: "sal_jan_2024_4500",
      },
      {
        type: "despesa" as const,
        description: "Supermercado Extra",
        amount: 350.00,
        date: new Date("2024-01-10"),
        effectiveDate: new Date("2024-01-10"),
        categoryId: createdCategories.find(c => c.name === "Alimentação")!.id,
        accountId: createdAccounts.find(a => a.name === "Conta Corrente BB")!.id,
        status: "confirmada" as const,
        isPaid: true,
        fitId: "DEB202401101",
        bankTransactionType: "DEBIT",
        payee: "Supermercado Extra",
        payeeCity: "São Paulo",
        payeeState: "SP",
        memo: "Compras mensais",
        currency: "BRL",
        location: "Shopping Center Norte",
        importSource: "manual",
        hash: "extra_jan_2024_350",
      },
      {
        type: "despesa" as const,
        description: "Posto Shell - Combustível",
        amount: 200.00,
        date: new Date("2024-01-12"),
        effectiveDate: new Date("2024-01-12"),
        categoryId: createdCategories.find(c => c.name === "Transporte")!.id,
        accountId: createdAccounts.find(a => a.name === "Conta Corrente BB")!.id,
        status: "confirmada" as const,
        isPaid: true,
        fitId: "DEB202401121",
        bankTransactionType: "DEBIT",
        payee: "Posto Shell",
        memo: "Abastecimento",
        currency: "BRL",
        importSource: "manual",
        hash: "shell_jan_2024_200",
      },
      {
        type: "receita" as const,
        description: "Freelance - Website E-commerce",
        amount: 1200.00,
        date: new Date("2024-01-15"),
        effectiveDate: new Date("2024-01-15"),
        categoryId: createdCategories.find(c => c.name === "Freelance")!.id,
        accountId: createdAccounts.find(a => a.name === "Poupança CEF")!.id,
        status: "confirmada" as const,
        isPaid: true,
        fitId: "PIX202401151",
        bankTransactionType: "CREDIT",
        payee: "Cliente ABC Ltda",
        memo: "Desenvolvimento website e-commerce",
        currency: "BRL",
        importSource: "manual",
        hash: "freelance_jan_2024_1200",
      },
      {
        type: "transferencia" as const,
        description: "Transferência para Poupança",
        amount: 500.00,
        date: new Date("2024-01-16"),
        effectiveDate: new Date("2024-01-16"),
        categoryId: createdCategories.find(c => c.name === "Transferência")!.id,
        accountId: createdAccounts.find(a => a.name === "Conta Corrente BB")!.id,
        destinationAccountId: createdAccounts.find(a => a.name === "Poupança CEF")!.id,
        status: "confirmada" as const,
        isPaid: true,
        fitId: "TRF202401161",
        bankTransactionType: "XFER",
        memo: "Transferência para reserva de emergência",
        currency: "BRL",
        importSource: "manual",
        hash: "transfer_jan_2024_500",
      },
      {
        type: "despesa" as const,
        description: "Cinema Cinemark",
        amount: 45.00,
        date: new Date("2024-01-18"),
        effectiveDate: new Date("2024-01-18"),
        categoryId: createdCategories.find(c => c.name === "Lazer")!.id,
        accountId: createdAccounts.find(a => a.name === "Nubank")!.id,
        status: "confirmada" as const,
        isPaid: true,
        fitId: "DEB202401181",
        bankTransactionType: "DEBIT",
        payee: "Cinemark Shopping",
        memo: "Sessão de cinema",
        currency: "BRL",
        location: "Shopping Eldorado",
        importSource: "manual",
        hash: "cinema_jan_2024_45",
      },
    ];

    const createdTransactions = await db
      .insert(transactions)
      .values(
        sampleTransactions.map(trans => ({
          userId,
          createdBy: userId,
          updatedBy: userId,
          ...trans,
        }))
      )
      .returning();

    // Criar transações recorrentes de exemplo
    const recurringTransactionsSample = [
      {
        name: "Salário Mensal",
        description: "Salário mensal da empresa",
        amount: 4500.00,
        type: "receita" as const,
        categoryId: createdCategories.find(c => c.name === "Salário")!.id,
        accountId: createdAccounts.find(a => a.name === "Conta Corrente BB")!.id,
        frequency: "mensal" as const,
        dayOfMonth: 5,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        isActive: true,
        nextDue: new Date("2024-02-05"),
      },
      {
        name: "Aluguel",
        description: "Aluguel do apartamento",
        amount: 1200.00,
        type: "despesa" as const,
        categoryId: createdCategories.find(c => c.name === "Moradia")!.id,
        accountId: createdAccounts.find(a => a.name === "Conta Corrente BB")!.id,
        frequency: "mensal" as const,
        dayOfMonth: 10,
        startDate: new Date("2024-01-01"),
        isActive: true,
        nextDue: new Date("2024-02-10"),
      },
    ];

    const createdRecurringTransactions = await db
      .insert(recurringTransactions)
      .values(
        recurringTransactionsSample.map(rec => ({
          userId,
          ...rec,
        }))
      )
      .returning();

    // Criar orçamentos de exemplo
    const budgetsSample = [
      {
        name: "Orçamento Alimentação",
        description: "Orçamento mensal para alimentação",
        amount: 800.00,
        spent: 350.00,
        remaining: 450.00,
        categoryId: createdCategories.find(c => c.name === "Alimentação")!.id,
        period: "mensal" as const,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        alertPercentage: 80,
        isActive: true,
        autoRenew: true,
      },
      {
        name: "Orçamento Transporte",
        description: "Orçamento mensal para transporte",
        amount: 400.00,
        spent: 200.00,
        remaining: 200.00,
        categoryId: createdCategories.find(c => c.name === "Transporte")!.id,
        period: "mensal" as const,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        alertPercentage: 75,
        isActive: true,
        autoRenew: true,
      },
    ];

    const createdBudgets = await db
      .insert(budgets)
      .values(
        budgetsSample.map(budget => ({
          userId,
          ...budget,
        }))
      )
      .returning();

    // Criar cartões de crédito de exemplo
    const creditCardsSample = [
      {
        name: "Cartão Nubank",
        brand: "mastercard" as const,
        type: "credito" as const,
        lastFourDigits: "1234",
        creditLimit: 5000.00,
        currentBalance: 1250.75,
        availableLimit: 3749.25,
        closingDay: 10,
        dueDay: 20,
        color: "#8b5cf6",
        isFavorite: true,
        isActive: true,
        notes: "Cartão principal para compras online",
      },
      {
        name: "Cartão Itaú",
        brand: "visa" as const,
        type: "credito_debito" as const,
        lastFourDigits: "5678",
        creditLimit: 3500.00,
        currentBalance: 0.00,
        availableLimit: 3500.00,
        closingDay: 5,
        dueDay: 15,
        color: "#f59e0b",
        isFavorite: false,
        isActive: true,
        notes: "Cartão com função débito e crédito",
      },
      {
        name: "Cartão XP",
        brand: "visa" as const,
        type: "credito" as const,
        lastFourDigits: "9012",
        creditLimit: 10000.00,
        currentBalance: 3250.42,
        availableLimit: 6749.58,
        closingDay: 15,
        dueDay: 25,
        color: "#10b981",
        isFavorite: false,
        isActive: true,
        notes: "Cartão premium com cashback",
      },
    ];

    const createdCreditCards = await db
      .insert(creditCards)
      .values(
        creditCardsSample.map(card => ({
          userId,
          ...card,
        }))
      )
      .returning();

    // Criar faturas de exemplo
    const invoicesSample = [
      {
        creditCardId: createdCreditCards[0].id,
        cardName: "Cartão Nubank",
        amount: 1250.75,
        minimumAmount: 125.08,
        previousBalance: 850.50,
        newBalance: 1250.75,
        creditLimit: 5000.00,
        availableCredit: 3749.25,
        dueDate: new Date("2024-02-20"),
        closingDate: new Date("2024-01-10"),
        periodStart: new Date("2023-12-11"),
        periodEnd: new Date("2024-01-10"),
        status: "aberta" as const,
        isPaid: false,
        paidAmount: 0,
        notes: "Fatura com compras do mês anterior",
      },
      {
        creditCardId: createdCreditCards[2].id,
        cardName: "Cartão XP",
        amount: 3250.42,
        minimumAmount: 325.04,
        previousBalance: 2100.00,
        newBalance: 3250.42,
        creditLimit: 10000.00,
        availableCredit: 6749.58,
        dueDate: new Date("2024-02-25"),
        closingDate: new Date("2024-01-15"),
        periodStart: new Date("2023-12-16"),
        periodEnd: new Date("2024-01-15"),
        status: "aberta" as const,
        isPaid: false,
        paidAmount: 0,
        notes: "Fatura com cashback acumulado",
      },
    ];

    const createdInvoices = await db
      .insert(invoices)
      .values(
        invoicesSample.map(invoice => ({
          userId,
          ...invoice,
        }))
      )
      .returning();

    console.log("✅ Seed do banco de dados concluído com sucesso!");
    console.log(`👤 Usuário criado: ${testUser[0].email}`);
    console.log(`🏦 Bancos criados: ${createdBanks.length}`);
    console.log(`📁 Categorias criadas: ${createdCategories.length}`);
    console.log(`💳 Contas criadas: ${createdAccounts.length}`);
    console.log(`💰 Transações criadas: ${createdTransactions.length}`);
    console.log(`🔄 Transações recorrentes: ${createdRecurringTransactions.length}`);
    console.log(`📊 Orçamentos criados: ${createdBudgets.length}`);
    console.log(`💳 Cartões de crédito criados: ${createdCreditCards.length}`);
    console.log(`📄 Faturas criadas: ${createdInvoices.length}`);
    
    console.log("\n🔑 Credenciais de acesso:");
    console.log("Email: teste@teste.com ou teste");
    console.log("Senha: teste");
    
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    throw error;
  }
}
