"use client";

import { useState } from "react";
import { RiArrowDownLine } from "@remixicon/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateExpenseForm } from "@/components/forms/create-expense-form";

export function CreateExpenseDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <RiArrowDownLine className="h-5 w-5" />
            <DialogTitle>Criar Despesa</DialogTitle>
          </div>
          <DialogDescription>
            Adicione uma nova despesa às suas finanças.
          </DialogDescription>
        </DialogHeader>
        <CreateExpenseForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
