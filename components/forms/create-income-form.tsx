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
import { Switch } from "@/components/ui/switch";
import { SingleDatePicker } from "@/components/single-date-picker";
import { toast } from "sonner";

const incomeFormSchema = z.object({
  descricao: z.string().min(2, {
    message: "A descrição deve ter pelo menos 2 caracteres.",
  }),
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
  categoria: z.string().min(1, "Por favor, selecione uma categoria."),
  conta: z.string().min(1, "Por favor, selecione uma conta."),
  fixa: z.boolean().default(false),
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

const categories = [
  { value: "salario", label: "Salário", color: "#22c55e" },
  { value: "freelance", label: "Freelance", color: "#3b82f6" },
  { value: "vendas", label: "Vendas", color: "#ef4444" },
];

const accounts = [
  { value: "conta1", label: "Conta Principal", color: "#f97316" },
  { value: "conta2", label: "Conta Secundária", color: "#8b5cf6" },
];

export function CreateIncomeForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      descricao: "",
      valor: "0,00",
      data: new Date(),
      categoria: "",
      conta: "",
      fixa: false,
    },
  });

  const handleSubmit = async (data: IncomeFormValues) => {
    try {
      setIsLoading(true);
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Receita criada com sucesso!");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao criar receita:", error);
      toast.error("Ocorreu um erro ao criar a receita. Tente novamente.");
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

  const selectedCategory = categories.find(
    (c) => c.value === form.watch("categoria")
  );
  const selectedAccount = accounts.find(
    (a) => a.value === form.watch("conta")
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          id="descricao"
          placeholder="Ex.: Salário, Freelance, Venda"
          {...form.register("descricao")}
        />
        {form.formState.errors.descricao && (
          <p className="text-sm text-red-500">
            {form.formState.errors.descricao.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor">Valor da Receita</Label>
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

      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Select
          onValueChange={(value) => form.setValue("categoria", value)}
          defaultValue={form.watch("categoria")}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedCategory.color }}
                />
              )}
              <SelectValue placeholder="Selecionar categoria" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.value}
                value={category.value}
                color={category.color}
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.categoria && (
          <p className="text-sm text-red-500">
            {form.formState.errors.categoria.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="conta">Conta Bancária</Label>
        <Select
          onValueChange={(value) => form.setValue("conta", value)}
          defaultValue={form.watch("conta")}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              {selectedAccount && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedAccount.color }}
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
        {form.formState.errors.conta && (
          <p className="text-sm text-red-500">
            {form.formState.errors.conta.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="fixa"
          checked={form.watch("fixa")}
          onCheckedChange={(checked) => form.setValue("fixa", !!checked)}
        />
        <Label htmlFor="fixa">Receita fixa</Label>
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
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Receita
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
