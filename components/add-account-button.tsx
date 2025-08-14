"use client";

import { RiAddLine } from "@remixicon/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreateAccountDialog } from "@/components/dialogs/create-account-dialog";
import { Button } from "@/components/button";

type ContaBancaria = {
  id: string;
  nome: string;
  banco: string;
  tipo: 'corrente' | 'poupança' | 'investimento' | 'outro';
  saldo: number;
  favorita: boolean;
};

interface AddAccountButtonProps {
  onAccountCreated?: (conta: Omit<ContaBancaria, 'id' | 'favorita'>) => void;
}

export function AddAccountButton({ onAccountCreated }: AddAccountButtonProps) {
  const isMobile = useIsMobile();
  
  const handleAccountCreated = (conta: Omit<ContaBancaria, 'id' | 'favorita'>) => {
    // Chama o callback da página de contas para recarregar a lista
    if (onAccountCreated) {
      onAccountCreated(conta);
    }
  };
  
  return (
    <CreateAccountDialog onAccountCreated={handleAccountCreated}>
      <Button>
        <RiAddLine className="size-5" size={20} aria-hidden="true" />
        <span className="max-lg:sr-only font-normal">Adicionar Conta</span>
      </Button>
    </CreateAccountDialog>
  );
}
