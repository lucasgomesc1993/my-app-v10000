"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { format, parseISO, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, AlertCircle, CreditCard } from "lucide-react";
import { Cartao, Fatura } from "@/types/fatura";

interface FaturaCardProps {
  fatura: Fatura;
  cartao: Cartao | null;
  onPagarFatura: (fatura: Fatura) => void;
}

export function FaturaCard({ fatura, cartao, onPagarFatura }: FaturaCardProps) {
  const status = obterStatusFatura(fatura);
  const dataVencimento = parseISO(fatura.dataVencimento);
  const hoje = new Date();
  const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  
  // Encontra o cartão associado à fatura
  const cartaoFatura = cartao;
  
  function obterStatusFatura(fatura: Fatura): StatusFatura {
    if (fatura.status === 'paga') return 'paga';
    
    const hoje = new Date();
    const vencimento = parseISO(fatura.dataVencimento);
    
    if (isBefore(vencimento, hoje)) return 'atrasada';
    return 'aberta';
  }
  
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: cartaoFatura?.cor || '#ccc' }}
      />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {format(parseISO(fatura.dataVencimento), "MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <div className="flex items-center mt-1 space-x-2">
              <Badge 
                variant={status === 'paga' ? 'default' : status === 'atrasada' ? 'destructive' : 'outline'}
                className="capitalize"
              >
                {status === 'paga' ? (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                ) : status === 'atrasada' ? (
                  <AlertCircle className="h-3 w-3 mr-1" />
                ) : null}
                {status}
              </Badge>
              {status !== 'paga' && (
                <span className="text-sm text-muted-foreground">
                  {diasAteVencimento > 0 
                    ? `Vence em ${diasAteVencimento} ${diasAteVencimento === 1 ? 'dia' : 'dias'}`
                    : 'Vencida'}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Valor total</p>
            <p className="text-lg font-semibold">
              {formatarMoeda(fatura.valorTotal)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Fechamento</p>
            <p>{format(parseISO(fatura.dataFechamento), 'dd/MM/yyyy')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Vencimento</p>
            <p>{format(parseISO(fatura.dataVencimento), 'dd/MM/yyyy')}</p>
          </div>
        </div>
        
        {fatura.itens.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Resumo de gastos</p>
            <div className="space-y-2">
              {fatura.itens.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-sm">{item.descricao}</span>
                  <span className="text-sm font-medium">{formatarMoeda(item.valor)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={() => onPagarFatura(fatura)}
          disabled={status === 'paga'}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {status === 'paga' ? 'Fatura Paga' : 'Pagar Fatura'}
        </Button>
      </CardFooter>
    </Card>
  );
}
