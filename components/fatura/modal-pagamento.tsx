"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Cartao, Fatura } from "@/types/fatura";

interface ModalPagamentoProps {
  isOpen: boolean;
  onClose: () => void;
  fatura: Fatura | null;
  cartao: Cartao | null;
  onConfirmarPagamento: (contaSelecionada: string) => void;
}

export function ModalPagamento({ 
  isOpen, 
  onClose, 
  fatura, 
  cartao,
  onConfirmarPagamento 
}: ModalPagamentoProps) {
  const [contaSelecionada, setContaSelecionada] = useState<string>("");

  if (!isOpen || !fatura || !cartao) return null;

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const handleConfirmar = () => {
    if (!contaSelecionada) return;
    onConfirmarPagamento(contaSelecionada);
    setContaSelecionada("");
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md" 
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="text-xl">Pagar Fatura</CardTitle>
          <p className="text-sm text-muted-foreground">
            Confirme os dados para realizar o pagamento
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Cartão</p>
            <div className="flex items-center p-3 border rounded-md">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: cartao.cor }}
              />
              <span>{cartao.nome}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Valor Total</p>
            <div className="text-2xl font-bold">
              {formatarMoeda(fatura.valorTotal)}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Vencimento</p>
            <p>{format(parseISO(fatura.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}</p>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Conta para Débito</p>
            <Select 
              value={contaSelecionada} 
              onValueChange={setContaSelecionada}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a conta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conta1">Conta Corrente - Banco do Brasil</SelectItem>
                <SelectItem value="conta2">Conta Poupança - Nubank</SelectItem>
                <SelectItem value="conta3">Conta Corrente - Inter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmar}
            disabled={!contaSelecionada}
          >
            Confirmar Pagamento
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
