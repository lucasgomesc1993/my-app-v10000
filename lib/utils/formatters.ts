import { format as dateFnsFormat, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

/**
 * Converte uma string de moeda para número
 * @param currencyValue String no formato de moeda (ex: "R$ 1.234,56")
 * @returns Número (ex: 1234.56)
 */
export const parseCurrency = (currencyValue: string): number => {
  if (!currencyValue) return 0;
  
  // Remove todos os caracteres que não são dígitos ou vírgula
  const numericString = currencyValue
    .replace(/[^\d,-]/g, '') // Remove tudo que não for número, vírgula ou hífen
    .replace(/\./g, '')      // Remove pontos de milhar
    .replace(',', '.');       // Substitui vírgula decimal por ponto
  
  const value = parseFloat(numericString);
  return isNaN(value) ? 0 : value;
};

/**
 * Formata uma data para o formato brasileiro (dd/MM/yyyy)
 * @param date Data (string, Date ou timestamp)
 * @param formatString Formato desejado (padrão: 'dd/MM/yyyy')
 * @returns Data formatada
 */
export const formatDate = (
  date: string | Date | number,
  formatString = 'dd/MM/yyyy'
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  return dateFnsFormat(dateObj, formatString, {
    locale: ptBR,
  });
};

/**
 * Formata uma data para exibição amigável (ex: "há 2 dias", "ontem", "hoje")
 * @param date Data (string, Date ou timestamp)
 * @returns String formatada
 */
export const formatDateRelative = (date: string | Date | number): string => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'hoje';
  if (diffInDays === 1) return 'ontem';
  if (diffInDays < 7) return `há ${diffInDays} dias`;
  
  return formatDate(dateObj, 'dd/MM/yyyy');
};

/**
 * Formata um CPF (000.000.000-00)
 * @param cpf Número do CPF (apenas dígitos)
 * @returns CPF formatado
 */
export const formatCPF = (cpf: string): string => {
  if (!cpf) return '';
  
  const cleaned = cpf.replace(/\D/g, '');
  
  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(\-\d{2})\d+?$/, '$1');
};

/**
 * Formata um CNPJ (00.000.000/0000-00)
 * @param cnpj Número do CNPJ (apenas dígitos)
 * @returns CNPJ formatado
 */
export const formatCNPJ = (cnpj: string): string => {
  if (!cnpj) return '';
  
  const cleaned = cnpj.replace(/\D/g, '');
  
  return cleaned
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(\-\d{2})\d+?$/, '$1');
};

/**
 * Formata um número de telefone (00) 00000-0000
 * @param phone Número de telefone (apenas dígitos)
 * @returns Telefone formatado
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length <= 10) {
    return cleaned
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})/, '$1-$2')
      .replace(/(\-\d{4})\d+?$/, '$1');
  } else {
    return cleaned
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})/, '$1-$2')
      .replace(/(\-\d{4})\d+?$/, '$1');
  }
};

/**
 * Formata um CEP (00000-000)
 * @param cep Número do CEP (apenas dígitos)
 * @returns CEP formatado
 */
export const formatCEP = (cep: string): string => {
  if (!cep) return '';
  
  const cleaned = cep.replace(/\D/g, '');
  
  return cleaned
    .replace(/(\d{5})(\d{1,3})/, '$1-$2')
    .replace(/(\-\d{3})\d+?$/, '$1');
};

/**
 * Formata um valor percentual (0-100)
 * @param value Valor percentual (0-100)
 * @returns String formatada com o símbolo de percentual
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

/**
 * Formata um número com separadores de milhar
 * @param value Valor numérico
 * @param decimals Número de casas decimais (padrão: 0)
 * @returns String formatada
 */
export const formatNumber = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};
