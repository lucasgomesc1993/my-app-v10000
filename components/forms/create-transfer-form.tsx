"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { SingleDatePicker } from "@/components/single-date-picker";
import { toast } from "sonner";

const transferFormSchema = z.object({
  origem: z.string().min(1, "Por favor, selecione a conta de origem."),
  destino: z.string().min(1, "Por favor, selecione a conta de destino."),
  valor: z.string().refine(
    (val) => {
      const num = parseFloat(val.replace(/[^0-9,-]+/g, "").replace(",", "."));
      return !isNaN(num) && num > 0;
    },
    {
      message: "Por favor, insira um valor válido e maior que zero.",
    }
  ),
  data: z.date({
    required_error: "Por favor, selecione uma data.",
  }),
}).refine((data) => data.origem !== data.destino, {
  message: "A conta de origem e destino não podem ser iguais.",
  path: ["destino"], // Atribui o erro ao campo de destino
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

const accounts = [
  { value: "conta1", label: "Conta Principal", color: "#f97316" },
  { value: "conta2", label: "Conta Secundária", color: "#8b5cf6" },
  { value: "conta3", label: "Carteira", color: "#22c55e" },
];

export function CreateTransferForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      origem: "",
      destino: "",
      valor: "0,00",
      data: new Date(),
    },
  });

  const handleSubmit = async (data: TransferFormValues) => {
    try {
      setIsLoading(true);
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Transferência realizada com sucesso!");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao realizar transferência:", error);
      toast.error("Ocorreu um erro ao realizar a transferência. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  const formatCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9,]/g, '');
    if (!value) {
      form.setValue("valor", "");
      return;
    }
    value = (parseInt(value.replace(/\D/g, '')) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    form.setValue("valor", value);
  };

  const selectedOriginAccount = accounts.find(
    (a) => a.value === form.watch("origem")
  );
  const selectedDestinationAccount = accounts.find(
    (a) => a.value === form.watch("destino")
  );

  // Filter out the selected origin account from destination options
  const destinationAccounts = accounts.filter(
    (account) => account.value !== form.watch("origem")
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="origem">Conta de Origem</Label>
        <Select
          onValueChange={(value) => form.setValue("origem", value)}
          defaultValue={form.watch("origem")}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              {selectedOriginAccount && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedOriginAccount.color }}
                />
              )}
              <SelectValue placeholder="Selecionar conta" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem
                key={account.value}
                value={account.value}
                color={account.color}
              >
                {account.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.origem && (
          <p className="text-sm text-red-500">
            {form.formState.errors.origem.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="destino">Conta de Destino</Label>
        <Select
          onValueChange={(value) => form.setValue("destino", value)}
          defaultValue={form.watch("destino")}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              {selectedDestinationAccount && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedDestinationAccount.color }}
                />
              )}
              <SelectValue placeholder="Selecionar conta" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {destinationAccounts.map((account) => (
              <SelectItem
                key={account.value}
                value={account.value}
                color={account.color}
              >
                {account.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.destino && (
          <p className="text-sm text-red-500">
            {form.formState.errors.destino.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor">Valor</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            R$&nbsp;
          </span>
          <Input
            id="valor"
            className="pl-12"
            value={form.watch("valor")}
            onChange={formatCurrency}
            placeholder="0,00"
            inputMode="decimal"
          />
        </div>
        {form.formState.errors.valor && (
          <p className="text-sm text-red-500">
            {form.formState.errors.valor.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="data">Data</Label>
        <SingleDatePicker
          value={form.watch("data")}
          onChange={(date) => form.setValue("data", date || new Date())}
        />
        {form.formState.errors.data && (
          <p className="text-sm text-red-500">
            {form.formState.errors.data.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Transferindo...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Transferência
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
