import { CheckCircle2, AlertCircle, Clock, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatarMoeda, formatarData, obterStatusFatura } from '../types';
import { Fatura, processarItensPorCategoria, CategoriaProcessada } from '@/types/fatura';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CategoriaLista } from './CategoriaLista';
import { useMemo } from 'react';

interface ModalDetalhesFaturaProps {
  aberto: boolean;
  fatura: Fatura | null;
  cartao: { id: string; nome: string; cor: string } | null;
  onFechar: () => void;
}

const mockItens = [
  { id: '1', descricao: 'Supermercado Extra', categoria: 'alimentacao', valor: 350.90, data: '2024-02-05' },
  { id: '2', descricao: 'Posto Ipiranga', categoria: 'transporte', valor: 200.00, data: '2024-02-07' },
  { id: '3', descricao: 'Restaurante Sabor da Terra', categoria: 'alimentacao', valor: 89.90, data: '2024-02-10' },
  { id: '4', descricao: 'Cinema', categoria: 'lazer', valor: 70.00, data: '2024-02-12' },
  { id: '5', descricao: 'Farmácia Droga Raia', categoria: 'saude', valor: 45.50, data: '2024-02-15' },
];

const categorias = {
  alimentacao: { nome: 'Alimentação', cor: 'bg-green-100 text-green-800' },
  transporte: { nome: 'Transporte', cor: 'bg-blue-100 text-blue-800' },
  lazer: { nome: 'Lazer', cor: 'bg-purple-100 text-purple-800' },
  saude: { nome: 'Saúde', cor: 'bg-red-100 text-red-800' },
  outros: { nome: 'Outros', cor: 'bg-gray-100 text-gray-800' },
};

export function ModalDetalhesFatura({ 
  aberto, 
  fatura, 
  cartao, 
  onFechar 
}: ModalDetalhesFaturaProps) {
  if (!fatura || !cartao) return null;

  // Obter status da fatura
  const status = obterStatusFatura(fatura);
  
  // Configuração de status
  const statusConfig = {
    paga: { 
      icon: CheckCircle2, 
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', 
      label: 'Paga',
      descricao: 'Fatura paga em dia'
    },
    atrasada: { 
      icon: AlertCircle, 
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', 
      label: 'Atrasada',
      descricao: 'Fatura vencida e não paga'
    },
    aberta: { 
      icon: Clock, 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', 
      label: 'Aberta',
      descricao: 'Fatura em aberto, aguardando pagamento'
    }
  };
  
  const { 
    icon: StatusIcon, 
    color: statusColor, 
    label: statusLabel,
    descricao: statusDescricao
  } = statusConfig[status];

  // Processar itens por categoria
  const categoriasProcessadas = useMemo<CategoriaProcessada[]>(
    () => processarItensPorCategoria(fatura.itens || []),
    [fatura.itens]
  );
  
  // Ordenar categorias por valorTotal (maior para menor)
  const categoriasOrdenadas = [...categoriasProcessadas].sort((a, b) => b.valorTotal - a.valorTotal);

  return (
    <Dialog open={aberto} onOpenChange={(open) => !open && onFechar()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-5 pb-3 border-b">
          <DialogTitle className="flex items-center gap-2.5 text-base">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-muted text-foreground">
              <span className="text-xs font-medium">{cartao.nome.charAt(0)}</span>
            </div>
            <span>Detalhes da Fatura</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-5 space-y-4">
          {/* Cabeçalho */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-muted/20 rounded-lg">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Cartão</p>
              <p className="text-sm font-medium">{cartao.nome}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Período</p>
              <p className="text-sm font-medium">Fev/2024</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Status</p>
              <div className="mt-0.5">
                <Badge 
                  className={cn("inline-flex items-center gap-1.5 text-xs h-6 px-2.5", statusColor)}
                  title={statusDescricao}
                >
                  <StatusIcon size={12} aria-hidden="true" />
                  <span>{statusLabel}</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Resumo</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Data de Fechamento</p>
                <p className="font-medium text-sm">{formatarData(fatura.dataFechamento)}</p>
              </div>
              <div className="space-y-1 p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Vencimento</p>
                <p className="font-medium text-sm">{formatarData(fatura.dataVencimento)}</p>
              </div>
              <div className="space-y-1 p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-base font-bold">{formatarMoeda(fatura.valorTotal)}</p>
              </div>
              <div className="space-y-1 p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Status de Pagamento</p>
                <p className="font-medium text-sm">
                  {fatura.status === 'paga' 
                    ? `Pago em ${formatarData(fatura.dataFechamento)}` 
                    : statusDescricao}
                </p>
              </div>
            </div>
          </div>

          {/* Gastos por Categoria */}
          <div className="mt-4">
            <CategoriaLista 
              categorias={categoriasOrdenadas.map(cat => ({
                ...cat,
                // Garantir que temos um ID único para cada categoria
                id: cat.id || cat.nome.toLowerCase().replace(/\s+/g, '-')
              }))} 
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
