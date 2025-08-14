"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTransferForm } from "@/components/forms/create-transfer-form";

export function CreateTransferDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            <DialogTitle>Realizar Transferência</DialogTitle>
          </div>
          <DialogDescription>
            Transfira dinheiro entre suas contas.
          </DialogDescription>
        </DialogHeader>
        <CreateTransferForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
