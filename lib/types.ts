import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  users,
  banks,
  categories,
  accounts,
  creditCards,
  transactions,
  invoices,
  recurringTransactions,
  budgets,
  importExports
} from './db/schema';

// Tipos base baseados nas tabelas do Drizzle
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Bank = InferSelectModel<typeof banks>;
export type NewBank = InferInsertModel<typeof banks>;

export type Category = InferSelectModel<typeof categories> & {
  parent?: Category;
  subcategories?: Category[];
};
export type NewCategory = InferInsertModel<typeof categories>;

export type Account = InferSelectModel<typeof accounts> & {
  bank?: Bank;
  balance?: number; // Saldo calculado
};
export type NewAccount = InferInsertModel<typeof accounts>;

export type CreditCard = InferSelectModel<typeof creditCards> & {
  bank?: Bank;
  currentInvoice?: Invoice;
  nextInvoice?: Invoice;
};
export type NewCreditCard = Omit<InferInsertModel<typeof creditCards>, 'dueDay' | 'closingDay'> & {
  dueDay: number;
  closingDay: number;
};

export type Transaction = InferSelectModel<typeof transactions> & {
  category?: Category;
  account?: Account;
  creditCard?: CreditCard;
  destinationAccount?: Account;
};
export type NewTransaction = Omit<InferInsertModel<typeof transactions>, 'date' | 'value'> & {
  date: string | Date;
  value: number | string;
};

export type Invoice = InferSelectModel<typeof invoices> & {
  creditCard?: CreditCard;
  transactions?: Transaction[];
};
export type NewInvoice = InferInsertModel<typeof invoices>;

export type RecurringTransaction = InferSelectModel<typeof recurringTransactions> & {
  category?: Category;
  account?: Account;
  creditCard?: CreditCard;
};
export type NewRecurringTransaction = InferInsertModel<typeof recurringTransactions>;

export type Budget = InferSelectModel<typeof budgets> & {
  category?: Category;
};
export type NewBudget = InferInsertModel<typeof budgets>;

export type ImportExport = InferSelectModel<typeof importExports>;
export type NewImportExport = InferInsertModel<typeof importExports>;

// Enums e tipos auxiliares
export type TransactionType = 'receita' | 'despesa' | 'transferencia';
export type AccountType = 'corrente' | 'poupanca' | 'investimento' | 'outro';
export type CreditCardBrand = 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'amex' | 'outro';
export type RecurrenceFrequency = 'diaria' | 'semanal' | 'mensal' | 'anual' | 'personalizada';
export type ImportExportStatus = 'pendente' | 'processando' | 'concluido' | 'erro';

// Tipos para formulários
export interface FormValues {
  // Valores comuns
  id?: number | string;
  name?: string;
  description?: string;
  notes?: string;
  
  // Para transações
  type?: TransactionType;
  value?: number | string;
  date?: string | Date;
  categoryId?: number | string;
  accountId?: number | string;
  destinationAccountId?: number | string;
  creditCardId?: number | string;
  
  // Para contas
  bankId?: number | string;
  accountType?: AccountType;
  agency?: string;
  accountNumber?: string;
  initialBalance?: number | string;
  
  // Para cartões
  brand?: CreditCardBrand;
  lastFourDigits?: string;
  creditLimit?: number | string;
  dueDay?: number;
  closingDay?: number;
  color?: string;
  
  // Para categorias
  color?: string;
  icon?: string;
  categoryType?: TransactionType;
  parentId?: number | string;
}

// Tipos para respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para paginação
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Tipos para filtros
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType | '';
  categoryId?: number | string;
  accountId?: number | string;
  creditCardId?: number | string;
  description?: string;
  minValue?: number;
  maxValue?: number;
  status?: string;
  tags?: string[];
}

// Tipos para gráficos e relatórios
export interface CategorySummary {
  category: Category;
  total: number;
  percentage: number;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

// Tipos para contexto de autenticação
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Tipos para notificações
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}
