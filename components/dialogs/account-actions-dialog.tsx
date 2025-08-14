"use client";

import { useState } from "react";
import { Eye, Edit, Trash2, CreditCard } from "lucide-react";

import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";


interface Conta {
  id: string;
  nome: string;
  tipo: string;
  saldo: number;
  banco: string;
  agencia?: string;
  conta?: string;
  favorita: boolean;
}

interface AccountActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Conta | null;
  onEdit: (account: Conta) => void;
  onDelete: (accountId: string) => void;
}

export function AccountActionsDialog({
  open,
  onOpenChange,
  account,
  onEdit,
  onDelete,
}: AccountActionsDialogProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  if (!account) return null;

  const handleEdit = () => {
    onEdit(account);
    onOpenChange(false);
  };

  const handleDelete = () => {
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    onDelete(account.id);
    setShowDeleteAlert(false);
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {account.nome}
            </DialogTitle>
            <DialogDescription>
              Visualize os detalhes da conta ou escolha uma ação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Informações da Conta */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Tipo
                </span>
                <Badge variant="secondary">{account.tipo}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Banco
                </span>
                <span className="text-sm font-medium">{account.banco}</span>
              </div>

              {account.agencia && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Agência
                  </span>
                  <span className="text-sm font-medium">{account.agencia}</span>
                </div>
              )}

              {account.conta && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Conta
                  </span>
                  <span className="text-sm font-medium">{account.conta}</span>
                </div>
              )}

              <div className="border-t my-3" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Saldo Atual
                </span>
                <span className={`text-lg font-bold ${
                  account.saldo >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatCurrency(account.saldo)}
                </span>
              </div>

              {account.favorita && (
                <div className="flex items-center justify-center pt-2">
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    ⭐ Conta Favorita
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmação de exclusão */}
      <Dialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a conta "{account.nome}"? 
              Esta ação não pode ser desfeita e todas as transações 
              associadas a esta conta serão afetadas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteAlert(false)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
