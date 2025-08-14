import { Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateBudgetForm } from "@/components/forms/create-budget-form";
import { useState } from "react";

type Props = {
  children?: React.ReactNode;
  onBudgetCreated?: () => void;
};

export function CreateBudgetDialog({ children, onBudgetCreated }: Props) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onBudgetCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <DialogTitle>Novo Orçamento</DialogTitle>
          </div>
          <DialogDescription className="pt-1">
            Defina um orçamento para controlar seus gastos.
          </DialogDescription>
        </DialogHeader>
        <CreateBudgetForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
