import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return format(date, "dd/MM/yyyy", { locale: ptBR })
}

export function formatDateTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function formatRelativeDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: ptBR 
  })
}

export function formatTransactionType(type: string): string {
  const types: Record<string, string> = {
    'receita': 'Receita',
    'despesa': 'Despesa',
    'transferencia': 'Transferência',
  }
  return types[type] || type
}

export function getTransactionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'receita': 'text-emerald-600 dark:text-emerald-400',
    'despesa': 'text-rose-600 dark:text-rose-400',
    'transferencia': 'text-blue-600 dark:text-blue-400',
  }
  return colors[type] || 'text-gray-600 dark:text-gray-400'
}

export function formatAccountType(type: string): string {
  const types: Record<string, string> = {
    'corrente': 'Conta Corrente',
    'poupança': 'Poupança',
    'investimento': 'Investimento',
    'outro': 'Outro',
  }
  return types[type] || type
}
