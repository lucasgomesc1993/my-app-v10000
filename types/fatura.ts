export type StatusFatura = 'aberta' | 'paga' | 'atrasada';

export interface ItemFatura {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
}

export interface Fatura {
  id: string;
  cartaoId: string;
  mes: number;
  ano: number;
  dataVencimento: string;
  dataFechamento: string;
  valorTotal: number;
  valorPago?: number;
  status: 'aberta' | 'paga' | 'vencida';
  itens: ItemFatura[];
}

export interface Cartao {
  id: string;
  nome: string;
  bandeira: 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'outro';
  tipo: 'credito' | 'debito' | 'credito_debito';
  cor: string;
  limite: number;
  fechamento: number;
  vencimento: number;
  faturaAtual: number;
  favorito: boolean;
}

// Tipos para o componente CategoriaLista
export interface TransacaoCategoria {
  id: string;
  descricao: string;
  valor: number;
  data: string;
}

export interface CategoriaProcessada {
  id: string;
  nome: string;
  cor: string;
  valorTotal: number;
  transacoes: TransacaoCategoria[];
}

// Mapeamento de cores para categorias (pode ser movido para um arquivo de tema/cores)
const CORES_CATEGORIAS: Record<string, string> = {
  'alimentacao': '#F59E0B', // Amarelo
  'transporte': '#3B82F6',  // Azul
  'moradia': '#8B5CF6',     // Roxo
  'saude': '#10B981',       // Verde
  'educacao': '#EC4899',    // Rosa
  'lazer': '#F97316',       // Laranja
  'compras': '#6366F1',     // Índigo
  'outros': '#64748B',      // Cinza
};

/**
 * Processa os itens de uma fatura, agrupando-os por categoria e calculando totais
 * @param itens Array de itens da fatura a serem processados
 * @returns Array de categorias processadas com suas transações e totais
 */
export function processarItensPorCategoria(itens: ItemFatura[]): CategoriaProcessada[] {
  // Agrupa itens por categoria
  const categoriasMap = itens.reduce<Record<string, CategoriaProcessada>>((acc, item) => {
    const categoriaNome = item.categoria.toLowerCase() || 'outros';
    
    if (!acc[categoriaNome]) {
      acc[categoriaNome] = {
        id: categoriaNome,
        nome: formatarNomeCategoria(categoriaNome),
        cor: CORES_CATEGORIAS[categoriaNome] || '#64748B', // Cor padrão se não encontrada
        valorTotal: 0,
        transacoes: []
      };
    }
    
    // Adiciona o valor ao total da categoria
    acc[categoriaNome].valorTotal += item.valor;
    
    // Adiciona a transação
    acc[categoriaNome].transacoes.push({
      id: item.id,
      descricao: item.descricao,
      valor: item.valor,
      data: item.data
    });
    
    return acc;
  }, {});
  
  // Ordena as categorias pelo valor total (maior primeiro)
  const categoriasOrdenadas = Object.values(categoriasMap)
    .sort((a, b) => b.valorTotal - a.valorTotal);
  
  return categoriasOrdenadas;
}

/**
 * Formata o nome da categoria para exibição (capitaliza a primeira letra)
 */
function formatarNomeCategoria(nome: string): string {
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}
