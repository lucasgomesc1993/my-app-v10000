import { Tag, Pencil } from "lucide-react";
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
import type { Categoria } from "@/types/index";

type Props = {
  children?: React.ReactNode;
  onCategoryCreated?: () => void;
  categoryToEdit?: Categoria | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CreateCategoryDialog({ 
  children, 
  onCategoryCreated, 
  categoryToEdit,
  open: isOpen,
  onOpenChange
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditMode = !!categoryToEdit;
  
  // Usa o estado controlado se as props forem fornecidas, caso contrário usa o estado interno
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const handleSuccess = () => {
    setOpen(false);
    onCategoryCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Pencil className="h-5 w-5" />
            ) : (
              <Tag className="h-5 w-5" />
            )}
            <DialogTitle>
              {isEditMode ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-1">
            {isEditMode 
              ? 'Atualize os detalhes da categoria.' 
              : 'Organize suas transações com categorias personalizadas.'}
          </DialogDescription>
        </DialogHeader>
        <CreateCategoryForm 
          onSuccess={handleSuccess} 
          categoryToEdit={isEditMode ? categoryToEdit : undefined}
        />
      </DialogContent>
    </Dialog>
  );
}