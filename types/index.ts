// Tipos de transação
export type TipoTransacao = 'receita' | 'despesa' | 'transferencia';

/**
 * Formata um valor monetário para o padrão brasileiro (R$ 1.234,56)
 * @param valor Valor numérico a ser formatado
 * @returns String formatada com o símbolo da moeda e casas decimais
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

/**
 * Formata uma data para o padrão brasileiro (dd/MM/yyyy)
 * @param data Data no formato string ou objeto Date
 * @returns String formatada no padrão brasileiro
 */
export function formatarData(data: string | Date): string {
  const date = typeof data === 'string' ? new Date(data) : data;
  
  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

// Interface para categorias
export interface Categoria {
  id: string;
  nome: string;
  cor: string;
  tipo: TipoTransacao;
  icone?: string;
}

// Interface para contas bancárias
export interface ContaBancaria {
  id: string;
  nome: string;
  banco: string;
  tipo: 'corrente' | 'poupança' | 'investimento' | 'outro';
  cor: string;
  saldo: number;
  favorita: boolean;
}

// Interface principal para transações
export interface Transacao {
  id: string;
  tipo: TipoTransacao;
  descricao: string;
  categoria: {
    id: string;
    nome: string;
    cor: string;
  };
  origem: {
    id: string;
    nome: string;
    tipo: 'conta' | 'cartao' | 'outro';
  };
  destino?: {
    id: string;
    nome: string;
    tipo: 'conta' | 'cartao' | 'outro';
  };
  data: Date;
  valor: number;
  valorConvertido?: number; // Para transações em moedas diferentes
  moeda?: string; // Código da moeda (ex: 'BRL', 'USD')
  pago: boolean;
  recorrente?: {
    id: string;
    frequencia: 'diaria' | 'semanal' | 'mensal' | 'anual';
    dataFim?: Date;
  };
  observacoes?: string;
  anexos?: Array<{
    id: string;
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
  }>;
  tags?: string[];
  criadoEm: Date;
  atualizadoEm: Date;
}

// Tipos para os filtros
export interface FiltrosTransacoes {
  tipos?: TipoTransacao[];
  categorias?: string[];
  contas?: string[];
  periodo?: {
    inicio: Date;
    fim: Date;
  };
  valorMin?: number;
  valorMax?: number;
  busca?: string;
  tags?: string[];
  pago?: boolean;
  recorrente?: boolean;
}

// Tipo para as opções de ordenação
export type OrdenacaoTransacoes = {
  campo: 'data' | 'valor' | 'descricao' | 'categoria';
  direcao: 'asc' | 'desc';
};

// Tipo para o formulário de transação
export type FormularioTransacao = Omit<Transacao, 'id' | 'criadoEm' | 'atualizadoEm' | 'categoria' | 'origem' | 'destino'> & {
  categoriaId: string;
  origemId: string;
  destinoId?: string;
};
