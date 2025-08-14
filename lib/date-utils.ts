import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns"
import { ptBR } from "date-fns/locale"

export const formatTransactionDate = (date: Date): string => {
  if (isToday(date)) {
    return "Hoje"
  }
  if (isYesterday(date)) {
    return "Ontem"
  }
  if (isThisWeek(date, { locale: ptBR })) {
    return format(date, "EEEE", { locale: ptBR })
  }
  if (isThisMonth(date, { locale: ptBR })) {
    return format(date, "d 'de' MMMM", { locale: ptBR })
  }
  return format(date, "dd/MM/yyyy", { locale: ptBR })
}

export const formatDateTime = (date: Date): string => {
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export const formatDateInput = (date: Date): string => {
  return format(date, "yyyy-MM-dd")
}

export const parseDateInput = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export const getStartOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export const getEndOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

export const getStartOfWeek = (date: Date): Date => {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Ajuste para começar na segunda-feira
  return new Date(date.setDate(diff))
}

export const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(date)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  return new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate(), 23, 59, 59, 999)
}
