"use client";

import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCreditCardForm } from "@/components/forms/create-credit-card-form";

type CartaoCredito = {
  id: string;
  nome: string;
  bandeira: 'visa' | 'mastercard' | 'elo' | 'outro';
  tipo: 'credito' | 'debito' | 'credito_debito';
  cor: string;
  limite: number;
  fechamento: number;
  vencimento: number;
  faturaAtual: number;
  favorito: boolean;
};

type CreateCreditCardDialogProps = {
  onCardCreated?: (cartao: Omit<CartaoCredito, 'id' | 'favorito' | 'faturaAtual'>) => void;
  children?: React.ReactNode;
};

export function CreateCreditCardDialog({ onCardCreated, children }: CreateCreditCardDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo Cartão</span>
            <span className="sr-only sm:hidden">Novo Cartão</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <DialogTitle>Novo Cartão de Crédito</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Crie um novo cartão de crédito para gerenciar seus gastos.
          </p>
        </DialogHeader>
        <CreateCreditCardForm onSuccess={handleSuccess} onSubmit={onCardCreated} />
      </DialogContent>
    </Dialog>
  );
}
