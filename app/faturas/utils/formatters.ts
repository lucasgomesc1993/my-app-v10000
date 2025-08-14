import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { isBefore } from 'date-fns';

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

export const formatarData = (data: Date | string): string => {
  const date = typeof data === 'string' ? new Date(data) : data;
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const obterStatusFatura = (fatura: { status: string; dataVencimento: string }): string => {
  const hoje = new Date();
  const vencimento = new Date(fatura.dataVencimento);
  
  if (fatura.status === 'paga') return 'paga';
  if (isBefore(hoje, vencimento)) return 'aberta';
  return 'atrasada';
};
