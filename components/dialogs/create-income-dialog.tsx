"use client";

import { useState } from "react";
import { RiArrowUpLine } from "@remixicon/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateIncomeForm } from "@/components/forms/create-income-form";

export function CreateIncomeDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <RiArrowUpLine className="h-5 w-5" />
            <DialogTitle>Criar Receita</DialogTitle>
          </div>
          <DialogDescription>
            Adicione uma nova receita às suas finanças.
          </DialogDescription>
        </DialogHeader>
        <CreateIncomeForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

