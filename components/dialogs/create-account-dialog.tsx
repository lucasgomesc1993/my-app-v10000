"use client";

import { useState } from "react";
import { Landmark, Plus } from "lucide-react";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateAccountForm } from "@/components/forms/create-account-form";

type ContaBancaria = {
  id: string;
  nome: string;
  banco: string;
  tipo: 'corrente' | 'poupança' | 'investimento' | 'outro';
  cor: string;
  saldo: number;
  favorita: boolean;
};

type CreateAccountDialogProps = {
  onAccountCreated?: (conta: Omit<ContaBancaria, 'id' | 'favorita'>) => void;
  children?: React.ReactNode;
};

export function CreateAccountDialog({ onAccountCreated, children }: CreateAccountDialogProps) {
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
            <span className="hidden sm:inline">Adicionar Conta</span>
            <span className="sr-only sm:hidden">Adicionar Conta</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            <DialogTitle>Nova Conta Bancária</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Crie uma nova conta para gerenciar suas finanças.
          </p>
        </DialogHeader>
        <CreateAccountForm 
          onSuccess={handleSuccess} 
          onSubmit={onAccountCreated}
        />
      </DialogContent>
    </Dialog>
  );
}
