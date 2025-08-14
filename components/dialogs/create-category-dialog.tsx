import { Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCategoryForm } from "../forms/create-category-form";
import { useState } from "react";

type Props = {
  children?: React.ReactNode;
  onCategoryCreated?: () => void;
};

export function CreateCategoryDialog({ children, onCategoryCreated }: Props) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onCategoryCreated) {
      onCategoryCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            <DialogTitle>Nova Categoria</DialogTitle>
          </div>
          <DialogDescription className="pt-1">
            Organize suas transações com categorias personalizadas.
          </DialogDescription>
        </DialogHeader>
        <CreateCategoryForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}