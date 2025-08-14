"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCreditCardExpenseForm } from "@/components/forms/create-credit-card-expense-form";

export function CreateCreditCardExpenseDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <DialogTitle>Criar Despesa no Cartão</DialogTitle>
          </div>
          <DialogDescription>
            Adicione uma nova despesa no seu cartão de crédito.
          </DialogDescription>
        </DialogHeader>
        <CreateCreditCardExpenseForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
