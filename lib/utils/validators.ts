import { z } from 'zod';
import { formatCPF, formatCNPJ, formatPhone, formatCEP } from './formatters';

// Esquemas base
const requiredField = (fieldName: string) => z.string().min(1, { message: `${fieldName} é obrigatório` });
const emailField = requiredField('E-mail').email('E-mail inválido');
const passwordField = requiredField('Senha').min(6, { message: 'A senha deve ter pelo menos 6 caracteres' });

// Validação de CPF (apenas validação de formato, não verifica dígitos verificadores)
const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/;
export const cpfSchema = z.string().refine(
  (value) => cpfRegex.test(value),
  { message: 'CPF inválido' }
);

// Validação de CNPJ (apenas validação de formato, não verifica dígitos verificadores)
const cnpjRegex = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}$/;
export const cnpjSchema = z.string().refine(
  (value) => cnpjRegex.test(value),
  { message: 'CNPJ inválido' }
);

// Validação de telefone (aceita (00) 0000-0000 ou (00) 00000-0000)
const phoneRegex = /^\(\d{2}\) \d{4,5}\-\d{4}$/;
export const phoneSchema = z.string().refine(
  (value) => phoneRegex.test(value),
  { message: 'Telefone inválido' }
);

// Validação de CEP (00000-000)
const cepRegex = /^\d{5}-\d{3}$/;
export const cepSchema = z.string().refine(
  (value) => cepRegex.test(value),
  { message: 'CEP inválido' }
);

// Validação de moeda (R$ 0,00)
const currencyRegex = /^R\$\s?\d{1,3}(\.\d{3})*,\d{2}$/;
export const currencySchema = z.string().refine(
  (value) => currencyRegex.test(value),
  { message: 'Valor monetário inválido' }
);

// Validação de data (dd/mm/aaaa)
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
export const dateSchema = z.string().refine(
  (value) => dateRegex.test(value),
  { message: 'Data inválida' }
);

// Esquemas de validação para cada tipo de formulário
export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const registerSchema = z.object({
  name: requiredField('Nome'),
  email: emailField,
  password: passwordField,
  confirmPassword: requiredField('Confirmação de senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

export const accountSchema = z.object({
  name: requiredField('Nome da conta'),
  bankId: z.string().min(1, { message: 'Selecione um banco' }),
  type: z.enum(['corrente', 'poupanca', 'investimento', 'outro'], {
    required_error: 'Selecione um tipo de conta',
  }),
  agency: z.string().optional(),
  accountNumber: z.string().optional(),
  initialBalance: z.string().refine(
    (value) => /^\d{1,3}(\.\d{3})*,\d{2}$/.test(value),
    { message: 'Saldo inicial inválido' }
  ).optional(),
  color: z.string().min(1, { message: 'Selecione uma cor' }),
});

export const creditCardSchema = z.object({
  name: requiredField('Nome no cartão'),
  brand: z.enum(['visa', 'mastercard', 'elo', 'hipercard', 'amex', 'outro'], {
    required_error: 'Selecione uma bandeira',
  }),
  lastFourDigits: z.string()
    .min(4, { message: 'Últimos 4 dígitos são obrigatórios' })
    .max(4, { message: 'Máximo de 4 dígitos' })
    .regex(/^\d+$/, { message: 'Apenas números são permitidos' }),
  creditLimit: z.string().refine(
    (value) => /^\d{1,3}(\.\d{3})*,\d{2}$/.test(value),
    { message: 'Limite inválido' }
  ),
  dueDay: z.number()
    .min(1, { message: 'Dia de vencimento inválido' })
    .max(31, { message: 'Dia de vencimento inválido' }),
  closingDay: z.number()
    .min(1, { message: 'Dia de fechamento inválido' })
    .max(31, { message: 'Dia de fechamento inválido' }),
  color: z.string().min(1, { message: 'Selecione uma cor' }),
});

export const categorySchema = z.object({
  name: requiredField('Nome da categoria'),
  type: z.enum(['receita', 'despesa', 'transferencia'], {
    required_error: 'Selecione um tipo de categoria',
  }),
  color: z.string().min(1, { message: 'Selecione uma cor' }),
  icon: z.string().min(1, { message: 'Selecione um ícone' }),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export const transactionSchema = z.object({
  description: requiredField('Descrição'),
  value: z.string().refine(
    (value) => /^\d{1,3}(\.\d{3})*,\d{2}$/.test(value),
    { message: 'Valor inválido' }
  ),
  type: z.enum(['receita', 'despesa', 'transferencia'], {
    required_error: 'Selecione um tipo de transação',
  }),
  date: z.string().refine(
    (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
    { message: 'Data inválida' }
  ),
  categoryId: z.string().min(1, { message: 'Selecione uma categoria' }),
  accountId: z.string().min(1, { message: 'Selecione uma conta' }),
  destinationAccountId: z.string().optional(),
  creditCardId: z.string().optional(),
  installments: z.number().min(1).max(999).optional(),
  notes: z.string().optional(),
});

// Funções auxiliares para validação
export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  return cpfRegex.test(formatCPF(cleaned));
};

export const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '');
  return cnpjRegex.test(formatCNPJ(cleaned));
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(formatPhone(cleaned));
};

export const validateCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '');
  return cepRegex.test(formatCEP(cleaned));
};

// Tipos inferidos dos esquemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AccountFormData = z.infer<typeof accountSchema>;
export type CreditCardFormData = z.infer<typeof creditCardSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
