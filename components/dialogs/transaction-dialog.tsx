"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Transacao, TipoTransacao } from "@/types";

const transactionSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  tipo: z.enum(["receita", "despesa", "transferencia"] as const),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  conta: z.string().min(1, "Conta é obrigatória"),
  data: z.date(),
  observacoes: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transacao;
  onSave: (data: TransactionForm) => Promise<void>;
}

// Mock data - em produção viria de APIs
const categorias = [
  { id: "1", nome: "Salário", tipo: "receita" },
  { id: "2", nome: "Alimentação", tipo: "despesa" },
  { id: "3", nome: "Transporte", tipo: "despesa" },
  { id: "4", nome: "Moradia", tipo: "despesa" },
  { id: "5", nome: "Lazer", tipo: "despesa" },
  { id: "6", nome: "Transferência", tipo: "transferencia" },
];

const contas = [
  { id: "1", nome: "Conta Corrente" },
  { id: "2", nome: "Conta Poupança" },
  { id: "3", nome: "Investimentos" },
];

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSave,
}: TransactionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoTransacao | "">("");

  const isEditing = !!transaction;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      data: new Date(),
    },
  });

  const watchedData = watch("data");
  const watchedTipo = watch("tipo");

  // Filtrar categorias por tipo
  const categoriasFiltradas = categorias.filter(
    cat => !watchedTipo || cat.tipo === watchedTipo
  );

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (open) {
      if (transaction) {
        reset({
          descricao: transaction.descricao,
          valor: transaction.valor,
          tipo: transaction.tipo,
          categoria: transaction.categoria.id,
          conta: transaction.origem.id,
          data: new Date(transaction.data),
          observacoes: transaction.observacoes || "",
        });
        setSelectedTipo(transaction.tipo);
      } else {
        reset({
          data: new Date(),
          descricao: "",
          valor: 0,
          tipo: "despesa",
          categoria: "",
          conta: "",
          observacoes: "",
        });
        setSelectedTipo("");
      }
    }
  }, [open, transaction, reset]);

  const onSubmit = async (data: TransactionForm) => {
    try {
      setIsLoading(true);
      await onSave(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Altere os dados da transação abaixo."
              : "Preencha os dados para criar uma nova transação."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={watchedTipo}
                onValueChange={(value: TipoTransacao) => {
                  setValue("tipo", value);
                  setValue("categoria", ""); // Reset categoria quando tipo muda
                  setSelectedTipo(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-sm text-destructive">{errors.tipo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                {...register("valor", { valueAsNumber: true })}
                className={cn(errors.valor && "border-destructive")}
              />
              {errors.valor && (
                <p className="text-sm text-destructive">{errors.valor.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Ex: Compra no supermercado"
              {...register("descricao")}
              className={cn(errors.descricao && "border-destructive")}
            />
            {errors.descricao && (
              <p className="text-sm text-destructive">{errors.descricao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={watch("categoria")}
                onValueChange={(value) => setValue("categoria", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasFiltradas.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && (
                <p className="text-sm text-destructive">{errors.categoria.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conta">Conta</Label>
              <Select
                value={watch("conta")}
                onValueChange={(value) => setValue("conta", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {contas.map((conta) => (
                    <SelectItem key={conta.id} value={conta.id}>
                      {conta.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.conta && (
                <p className="text-sm text-destructive">{errors.conta.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchedData && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedData ? (
                    format(watchedData, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                  <Input
                    type="date"
                    value={watchedData ? format(watchedData, "yyyy-MM-dd") : ""}
                    onChange={(e) => setValue("data", new Date(e.target.value))}
                  />
                </div>
              </PopoverContent>
            </Popover>
            {errors.data && (
              <p className="text-sm text-destructive">{errors.data.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Input
              id="observacoes"
              placeholder="Informações adicionais sobre a transação"
              {...register("observacoes")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                isEditing ? "Salvar Alterações" : "Criar Transação"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
