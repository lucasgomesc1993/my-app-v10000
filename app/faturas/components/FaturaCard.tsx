import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, AlertCircle, Clock, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Fatura, Cartao } from '@/types/fatura';
import { formatarMoeda, formatarData, obterStatusFatura } from '../types';

interface FaturaCardProps {
  fatura: Fatura;
  cartao: Cartao | null;
  onPagarFatura: (fatura: Fatura) => void;
  onVerDetalhes: (fatura: Fatura) => void;
}

export function FaturaCard({ fatura, cartao, onPagarFatura, onVerDetalhes }: FaturaCardProps) {
  const status = obterStatusFatura(fatura);
  const dataVencimento = new Date(fatura.dataVencimento);
  const hoje = new Date();
  const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

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

  return (
    <Card className="h-full flex flex-col overflow-hidden border border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80 group hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-card/50 dark:to-card/30 pointer-events-none" />
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-start gap-3">
          <div 
            className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" 
            style={{ 
              backgroundColor: cartao?.cor ? `${cartao.cor}1a` : 'rgba(138, 5, 190, 0.1)',
              color: cartao?.cor || '#8A05BE'
            }}
            aria-hidden="true"
          >
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {cartao?.nome || 'Cartão não encontrado'}
            </CardTitle>
            <p className="text-sm text-muted-foreground truncate">
              {format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
            </p>
          </div>
          <Badge 
            className={cn("ml-auto flex items-center gap-1 flex-shrink-0", statusColor)}
            title={statusDescricao}
          >
            <StatusIcon size={14} aria-hidden="true" />
            <span>{statusLabel}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-4 flex-grow flex flex-col">
        <div className="space-y-4">
          <div className="grid grid-cols-2 pt-2">
            <div className="pr-2">
              <p className="text-sm text-muted-foreground">Vencimento</p>
              <p className="font-medium">{formatarData(fatura.dataVencimento)}</p>
            </div>
            <div className="pl-2">
              <p className="text-sm text-muted-foreground text-right">Fechamento</p>
              <p className="font-medium text-right">{formatarData(fatura.dataFechamento)}</p>
            </div>
          </div>
          
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold">{formatarMoeda(fatura.valorTotal)}</span>
            </div>
            
            {fatura.status === 'paga' && fatura.valorPago && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Valor Pago:</span>
                <span className="text-green-600 font-medium">
                  {formatarMoeda(fatura.valorPago)}
                </span>
              </div>
            )}
            
            {status === 'aberta' && diasAteVencimento <= 7 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400">
                  <span>
                    {diasAteVencimento > 0 
                      ? `Vence em ${diasAteVencimento} ${diasAteVencimento === 1 ? 'dia' : 'dias'}`
                      : 'Vence hoje'}
                  </span>
                  <span className="font-medium">
                    {diasAteVencimento === 0 ? 'Hoje' : 
                     diasAteVencimento === 1 ? 'Amanhã' : 
                     format(dataVencimento, "dd/MM")}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      diasAteVencimento <= 3 ? 'bg-red-500' : 'bg-amber-500'
                    )}
                    style={{ 
                      width: `${Math.min(100, Math.max(0, 100 - (diasAteVencimento * 14)))}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="relative z-10 pt-0 mt-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {/* Botão de Detalhes */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onVerDetalhes(fatura)}
            aria-label={`Ver detalhes da fatura de ${formatarMoeda(fatura.valorTotal)}`}
          >
            <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
            Detalhes
          </Button>

          {/* Botão de Pagamento (apenas para faturas abertas/atrasadas) */}
          {(status === 'aberta' || status === 'atrasada') && (
            <Button 
              variant="default" 
              size="sm" 
              className="w-full bg-primary hover:bg-primary/90 transition-colors"
              onClick={() => onPagarFatura(fatura)}
              aria-label={`Pagar fatura de ${formatarMoeda(fatura.valorTotal)}`}
            >
              <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
              Pagar Fatura
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
