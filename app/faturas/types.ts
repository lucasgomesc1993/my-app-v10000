import { format, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Fatura, Cartao, StatusFatura } from '@/types/fatura';

// Re-export types from the main types file
export type { Cartao, Fatura, StatusFatura, ItemFatura } from '@/types/fatura';

export interface FaturasPorCategoria {
  atuais: Fatura[];
  futuras: Fatura[];
  passadas: Fatura[];
}

export interface FaturaCardProps {
  fatura: Fatura;
  cartao: Cartao | null;
  onPagarFatura: (fatura: Fatura) => void;
}

export interface ListaVaziaProps {
  icone: React.ReactNode;
  titulo: string;
  mensagem: string;
}

// Função utilitária para formatar valores em moeda brasileira
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

// Função para formatar datas no formato brasileiro
export const formatarData = (data: Date | string): string => {
  const date = typeof data === 'string' ? new Date(data) : data;
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

// Função para obter o status da fatura
export const obterStatusFatura = (fatura: Fatura): StatusFatura => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Normaliza a data atual para meia-noite
  
  const vencimento = new Date(fatura.dataVencimento);
  vencimento.setHours(0, 0, 0, 0); // Normaliza a data de vencimento para meia-noite
  
  console.log('Verificando status da fatura:', {
    faturaId: fatura.id,
    statusAtual: fatura.status,
    dataVencimento: vencimento,
    hoje: hoje,
    vencida: vencimento < hoje
  });
  
  // Se a fatura já está marcada como paga, retorna 'paga'
  if (fatura.status === 'paga') {
    console.log('  -> Fatura já paga');
    return 'paga';
  }
  
  // Se a data de vencimento é anterior à data atual, retorna 'atrasada'
  if (vencimento < hoje) {
    console.log('  -> Fatura atrasada');
    return 'atrasada';
  }
  
  // Caso contrário, a fatura está 'aberta'
  console.log('  -> Fatura aberta');
  return 'aberta';
};
