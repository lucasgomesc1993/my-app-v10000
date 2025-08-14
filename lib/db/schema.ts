import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

// Tabela de usuários
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  cpf: text("cpf"), // Para identificação OFX
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("BR"),
  timezone: text("timezone").default("America/Sao_Paulo"),
  currency: text("currency").default("BRL"),
  dateFormat: text("date_format").default("DD/MM/YYYY"),
  language: text("language").default("pt-BR"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tabela de bancos (para padronização OFX)
export const banks = sqliteTable("banks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(), // Código FEBRABAN
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  website: text("website"),
  ofxUrl: text("ofx_url"), // URL para download OFX
  ofxVersion: text("ofx_version").default("102"), // Versão OFX suportada
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tabela de categorias
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", { enum: ["receita", "despesa", "transferencia"] }).notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  description: text("description"),
  parentId: integer("parent_id").references(() => categories.id), // Para subcategorias
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  // Campos para mapeamento OFX
  ofxCategory: text("ofx_category"), // Categoria padrão OFX
  taxDeductible: integer("tax_deductible", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tabela de contas bancárias
export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bankId: integer("bank_id").references(() => banks.id),
  name: text("name").notNull(),
  bank: text("bank").notNull(), // Nome do banco (redundante para compatibilidade)
  type: text("type", { enum: ["corrente", "poupança", "investimento", "cartao_credito", "cartao_debito", "outro"] }).notNull(),
  subtype: text("subtype"), // Subtipo específico da conta
  color: text("color").notNull(),
  balance: real("balance").notNull().default(0),
  initialBalance: real("initial_balance").default(0),
  creditLimit: real("credit_limit").default(0), // Para cartões de crédito
  isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  
  // Dados bancários completos para OFX
  agency: text("agency"),
  agencyDigit: text("agency_digit"),
  accountNumber: text("account_number"),
  accountDigit: text("account_digit"),
  bankCode: text("bank_code"), // Código FEBRABAN
  branchId: text("branch_id"), // ID da agência
  accountId: text("account_id"), // ID único da conta no banco
  
  // Configurações OFX
  ofxAccountType: text("ofx_account_type"), // CHECKING, SAVINGS, CREDITLINE, etc.
  ofxBankId: text("ofx_bank_id"), // ID do banco no OFX
  ofxBranchId: text("ofx_branch_id"), // ID da agência no OFX
  ofxAccountId: text("ofx_account_id"), // ID da conta no OFX
  ofxKey: text("ofx_key"), // Chave para acesso OFX
  ofxUrl: text("ofx_url"), // URL específica para esta conta
  ofxVersion: text("ofx_version").default("102"),
  
  // Metadados
  description: text("description"),
  notes: text("notes"),
  lastSyncAt: integer("last_sync_at", { mode: "timestamp" }),
  syncEnabled: integer("sync_enabled", { mode: "boolean" }).default(false),
  
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tabela de transações (completa para OFX)
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Dados básicos da transação
  type: text("type", { enum: ["receita", "despesa", "transferencia", "bill_payment"] }).notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  originalAmount: real("original_amount"), // Valor original antes de conversões
  date: integer("date", { mode: "timestamp" }).notNull(),
  effectiveDate: integer("effective_date", { mode: "timestamp" }), // Data de efetivação
  dueDate: integer("due_date", { mode: "timestamp" }), // Data de vencimento
  
  // Relacionamentos
  categoryId: integer("category_id").notNull().references(() => categories.id),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  destinationAccountId: integer("destination_account_id").references(() => accounts.id),
  
  // Status e controle
  status: text("status", { enum: ["pendente", "confirmada", "cancelada", "estornada"] }).default("confirmada"),
  isPaid: integer("is_paid", { mode: "boolean" }).notNull().default(false),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  recurringId: integer("recurring_id").references(() => transactions.id), // Para transações recorrentes
  
  // Dados OFX obrigatórios
  fitId: text("fit_id"), // Financial Institution Transaction ID (único por instituição)
  checkNumber: text("check_number"), // Número do cheque
  referenceNumber: text("reference_number"), // Número de referência
  sic: text("sic"), // Standard Industrial Code
  payeeListId: text("payee_list_id"), // ID do beneficiário
  
  // Dados OFX opcionais
  serverTransactionId: text("server_transaction_id"), // ID da transação no servidor
  correctFitId: text("correct_fit_id"), // Para correções
  correctAction: text("correct_action"), // REPLACE ou DELETE
  investmentTransactionType: text("investment_transaction_type"), // Para investimentos
  securityId: text("security_id"), // ID do título/ação
  units: real("units"), // Quantidade de unidades (investimentos)
  unitPrice: real("unit_price"), // Preço unitário
  commission: real("commission"), // Comissão
  taxes: real("taxes"), // Impostos
  fees: real("fees"), // Taxas
  load: real("load"), // Taxa de carregamento
  withholding: real("withholding"), // Retenção
  taxExempt: integer("tax_exempt", { mode: "boolean" }).default(false),
  
  // Dados bancários específicos
  bankTransactionType: text("bank_transaction_type"), // CREDIT, DEBIT, INT, DIV, FEE, etc.
  subAccountFrom: text("sub_account_from"), // Subconta origem
  subAccountTo: text("sub_account_to"), // Subconta destino
  
  // Informações adicionais
  memo: text("memo"), // Memo/observação do banco
  payee: text("payee"), // Beneficiário/pagador
  payeeAccount: text("payee_account"), // Conta do beneficiário
  payeeBank: text("payee_bank"), // Banco do beneficiário
  payeeCity: text("payee_city"), // Cidade do beneficiário
  payeeState: text("payee_state"), // Estado do beneficiário
  payeePostalCode: text("payee_postal_code"), // CEP do beneficiário
  payeeCountry: text("payee_country"), // País do beneficiário
  payeePhone: text("payee_phone"), // Telefone do beneficiário
  
  // Moeda e conversão
  currency: text("currency").default("BRL"),
  exchangeRate: real("exchange_rate").default(1.0),
  originalCurrency: text("original_currency"),
  
  // Localização e contexto
  location: text("location"), // Local da transação
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  // Metadados e controle
  notes: text("notes"), // Observações do usuário
  tags: text("tags"), // JSON string array
  attachments: text("attachments"), // JSON array de anexos
  importSource: text("import_source"), // Fonte da importação (OFX, CSV, manual)
  importDate: integer("import_date", { mode: "timestamp" }),
  importBatch: text("import_batch"), // Lote de importação
  hash: text("hash"), // Hash para detectar duplicatas
  
  // Auditoria
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tabela de cartões de crédito
export const creditCards = sqliteTable("credit_cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Dados básicos do cartão
  name: text("name").notNull(),
  brand: text("brand", { enum: ["visa", "mastercard", "elo", "hipercard", "american_express", "outro"] }).notNull(),
  type: text("type", { enum: ["credito", "debito", "credito_debito"] }).notNull(),
  lastFourDigits: text("last_four_digits").notNull(),
  
  // Limites e valores
  creditLimit: real("credit_limit").default(0),
  currentBalance: real("current_balance").default(0),
  availableLimit: real("available_limit").default(0),
  
  // Datas importantes
  closingDay: integer("closing_day").notNull(), // Dia do fechamento (1-31)
  dueDay: integer("due_day").notNull(), // Dia do vencimento (1-31)
  
  // Configurações
  color: text("color").default("#3b82f6"),
  isFavorite: integer("is_favorite", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  
  // Metadados
  notes: text("notes"),
  
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tabela de faturas de cartão
export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  creditCardId: integer("credit_card_id").notNull().references(() => creditCards.id, { onDelete: "cascade" }),
  
  // Dados da fatura
  cardName: text("card_name").notNull(),
  amount: real("amount").notNull(),
  minimumAmount: real("minimum_amount").default(0),
  previousBalance: real("previous_balance").default(0),
  newBalance: real("new_balance").default(0),
  creditLimit: real("credit_limit").default(0),
  availableCredit: real("available_credit").default(0),
  
  // Datas importantes
  dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
  closingDate: integer("closing_date", { mode: "timestamp" }).notNull(),
  periodStart: integer("period_start", { mode: "timestamp" }),
  periodEnd: integer("period_end", { mode: "timestamp" }),
  
  // Status e pagamento
  status: text("status", { enum: ["aberta", "paga", "vencida", "cancelada"] }).default("aberta"),
  isPaid: integer("is_paid", { mode: "boolean" }).notNull().default(false),
  paidAt: integer("paid_at", { mode: "timestamp" }),
  paidAmount: real("paid_amount").default(0),
  paidAccountId: integer("paid_account_id").references(() => accounts.id),
  
  // Dados OFX
  statementId: text("statement_id"), // ID do extrato
  fitId: text("fit_id"), // Financial Institution Transaction ID
  
  // Metadados
  notes: text("notes"),
  importSource: text("import_source"),
  importDate: integer("import_date", { mode: "timestamp" }),
  
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tabela de transações recorrentes
export const recurringTransactions = sqliteTable("recurring_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Template da transação
  name: text("name").notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  type: text("type", { enum: ["receita", "despesa", "transferencia"] }).notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  destinationAccountId: integer("destination_account_id").references(() => accounts.id),
  
  // Configuração de recorrência
  frequency: text("frequency", { enum: ["diaria", "semanal", "quinzenal", "mensal", "bimestral", "trimestral", "semestral", "anual"] }).notNull(),
  interval: integer("interval").default(1), // A cada X períodos
  dayOfMonth: integer("day_of_month"), // Dia do mês (para mensal)
  dayOfWeek: integer("day_of_week"), // Dia da semana (0=domingo)
  
  // Período de vigência
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  maxOccurrences: integer("max_occurrences"), // Máximo de ocorrências
  currentOccurrences: integer("current_occurrences").default(0),
  
  // Status
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  lastGenerated: integer("last_generated", { mode: "timestamp" }),
  nextDue: integer("next_due", { mode: "timestamp" }),
  
  // Metadados
  notes: text("notes"),
  tags: text("tags"),
  
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tabela de orçamentos
export const budgets = sqliteTable("budgets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => categories.id),
  
  // Dados do orçamento
  name: text("name").notNull(),
  description: text("description"),
  amount: real("amount").notNull(),
  spent: real("spent").default(0),
  remaining: real("remaining").default(0),
  
  // Período
  period: text("period", { enum: ["mensal", "trimestral", "semestral", "anual"] }).default("mensal"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  
  // Configurações
  alertPercentage: real("alert_percentage").default(80), // Alerta em X% do orçamento
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  autoRenew: integer("auto_renew", { mode: "boolean" }).default(false),
  
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tabela de importações/exportações
export const importExports = sqliteTable("import_exports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Dados da operação
  type: text("type", { enum: ["import", "export"] }).notNull(),
  format: text("format", { enum: ["ofx", "csv", "excel", "json"] }).notNull(),
  status: text("status", { enum: ["pending", "processing", "completed", "failed"] }).default("pending"),
  
  // Arquivo
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  filePath: text("file_path"),
  fileHash: text("file_hash"),
  
  // Resultados
  totalRecords: integer("total_records").default(0),
  processedRecords: integer("processed_records").default(0),
  errorRecords: integer("error_records").default(0),
  duplicateRecords: integer("duplicate_records").default(0),
  
  // Configurações
  accountId: integer("account_id").references(() => accounts.id),
  dateRange: text("date_range"), // JSON com período
  categories: text("categories"), // JSON com categorias selecionadas
  options: text("options"), // JSON com opções específicas
  
  // Log e erros
  log: text("log"), // Log detalhado da operação
  errors: text("errors"), // JSON com erros encontrados
  
  // Metadados
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tipos para TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Bank = typeof banks.$inferSelect;
export type NewBank = typeof banks.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type CreditCard = typeof creditCards.$inferSelect;
export type NewCreditCard = typeof creditCards.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type RecurringTransaction = typeof recurringTransactions.$inferSelect;
export type NewRecurringTransaction = typeof recurringTransactions.$inferInsert;

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;

export type ImportExport = typeof importExports.$inferSelect;
export type NewImportExport = typeof importExports.$inferInsert;
