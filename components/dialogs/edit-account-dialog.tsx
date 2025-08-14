"use client";

import { useState } from "react";
import { Landmark } from "lucide-react";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { EditAccountForm } from "@/components/forms/edit-account-form";

interface ContaBancaria {
  id: string;
  name: string;
  bankName?: string;
  type: 'corrente' | 'poupanca' | 'investimento' | 'outro';
  balance: number;
  isFavorite?: boolean;
}

interface EditAccountDialogProps {
  account: ContaBancaria | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountUpdated?: () => void;
}

export function EditAccountDialog({ 
  account, 
  open, 
  onOpenChange, 
  onAccountUpdated 
}: EditAccountDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onAccountUpdated) {
      onAccountUpdated();
    }
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            <DialogTitle>Editar Conta Bancária</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Atualize as informações da sua conta bancária.
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Funcionalidade de edição em desenvolvimento.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
