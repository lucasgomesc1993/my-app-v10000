import { useState } from 'react';
import { CheckCircle2, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { formatarMoeda } from '../types';
import { Fatura } from '@/types/fatura';

interface ModalPagamentoProps {
  aberto: boolean;
  fatura: Fatura | null;
  cartao: { id: string; nome: string; cor: string } | null;
  contas: Array<{ id: string; nome: string; saldo: number }>;
  onConfirmar: (contaId: string) => Promise<void>;
  onFechar: () => void;
}

interface Conta {
  id: string;
  nome: string;
  saldo: number;
}

interface Cartao {
  id: string;
  nome: string;
  cor: string;
}

interface ModalPagamentoState {
  contaSelecionada: string;
  processando: boolean;
}

export function ModalPagamento({ 
  aberto, 
  fatura, 
  cartao, 
  contas, 
  onConfirmar, 
  onFechar 
}: ModalPagamentoProps) {
  const [state, setState] = useState<ModalPagamentoState>({
    contaSelecionada: '',
    processando: false,
  });

  const handleConfirmar = async () => {
    if (!state.contaSelecionada) return;
    
    try {
      setState({ ...state, processando: true });
      await onConfirmar(state.contaSelecionada);
      setState({ contaSelecionada: '', processando: false });
      onFechar();
    } catch (erro) {
      console.error('Erro ao processar pagamento:', erro);
    } finally {
      setState({ ...state, processando: false });
    }
  };

  if (!fatura || !cartao) return null;

  return (
    <Dialog open={aberto} onOpenChange={(open) => !open && onFechar()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <CheckCircle2 className="h-5 w-5 text-white" />
            Pagar Fatura
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Confirme os detalhes do pagamento
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Cartão</Label>
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: cartao.cor }}
              />
              <span>{cartao.nome}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Valor Total</Label>
            <div className="text-2xl font-bold">
              {formatarMoeda(fatura.valorTotal)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conta">Conta para Débito</Label>
            <Select 
              value={state.contaSelecionada} 
              onValueChange={(value) => setState({ ...state, contaSelecionada: value })}
              disabled={state.processando}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {contas.map((conta: Conta) => (
                  <SelectItem key={conta.id} value={conta.id}>
                    {conta.nome} ({formatarMoeda(conta.saldo)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onFechar}
            disabled={state.processando}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!state.contaSelecionada || state.processando}
            type="submit"
            variant="outline"
            className="bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 border-gray-200"
          >  
            {state.processando ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Processando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Confirmar Pagamento
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
