"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: { id: string; name: string };
  onSuccess: () => void;
}

export function DeleteCategoryDialog({ open, onOpenChange, category, onSuccess }: DeleteCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(true);

  // Buscar contagem de transações quando o modal abrir
  useEffect(() => {
    if (open) {
      const fetchTransactionCount = async () => {
        try {
          setIsCounting(true);
          const count = await api.countTransactionsByCategory(category.id);
          setTransactionCount(count);
        } catch (error) {
          console.error("Erro ao buscar transações:", error);
          toast.error("Não foi possível verificar as transações relacionadas");
          onOpenChange(false);
        } finally {
          setIsCounting(false);
        }
      };

      fetchTransactionCount();
    } else {
      // Resetar estado quando fechar
      setTransactionCount(null);
      setIsCounting(true);
    }
  }, [open, category.id, onOpenChange]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await api.excluirCategoria(category.id);
      toast.success("Categoria excluída com sucesso!");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir categoria");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Excluir Categoria
          </DialogTitle>
          <DialogDescription>
            {isCounting ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verificando transações relacionadas...</span>
              </div>
            ) : transactionCount && transactionCount > 0 ? (
              <div className="space-y-4 py-2">
                <div className="rounded-md bg-destructive/10 p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Atenção!</span>
                  </div>
                  <div className="mt-2 text-sm text-destructive">
                    <p className="mb-2">
                      Existem <span className="font-bold">{transactionCount} transações</span> cadastradas com a categoria "{category.name}".
                    </p>
                    <p>
                      Ao confirmar, estas transações serão automaticamente classificadas como "Sem Categoria".
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tem certeza que deseja continuar com a exclusão?
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja excluir a categoria <span className="font-medium text-foreground">"{category.name}"</span>? 
                Esta ação não pode ser desfeita.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir Categoria"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
