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
import { Badge } from "@/components/badge";

const creditCardExpenseFormSchema = z.object({
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
  parcelas: z.number().min(1).max(18).default(1),
  data: z.date({
    required_error: "Por favor, selecione uma data.",
  }),
  categoria: z.string().min(1, "Por favor, selecione uma categoria."),
  cartao: z.string().min(1, "Por favor, selecione um cartão de crédito."),
  fatura: z.string().min(1, "Por favor, selecione a fatura."),
});

type CreditCardExpenseFormValues = z.infer<typeof creditCardExpenseFormSchema>;

// Helper para gerar as opções de fatura
const getInvoiceOptions = () => {
  const options = [];
  const today = new Date();
  for (let i = 0; i < 4; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 5);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const year = date.getFullYear().toString().slice(-2);
    
    const label = `${day} ${month} ${year}`;
    const value = date.toISOString();
    const isCurrent = i === 1; // Marcar o segundo item como "Atual" para fins de exemplo

    options.push({ label, value, isCurrent });
  }
  return options;
};

const categories = [
  { value: "alimentacao", label: "Alimentação", color: "#ef4444" },
  { value: "transporte", label: "Transporte", color: "#3b82f6" },
  { value: "lazer", label: "Lazer", color: "#8b5cf6" },
];

const creditCards = [
  { value: "cartao1", label: "Cartão Principal", color: "#f97316" },
  { value: "cartao2", label: "Cartão Secundário", color: "#14b8a6" },
];

export function CreateCreditCardExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const invoiceOptions = getInvoiceOptions();

  const form = useForm<CreditCardExpenseFormValues>({
    resolver: zodResolver(creditCardExpenseFormSchema),
    defaultValues: {
      descricao: "",
      valor: "0,00",
      parcelas: 1,
      data: new Date(),
      categoria: "",
      cartao: "",
      fatura: invoiceOptions.find(o => o.isCurrent)?.value,
    },
  });

  const handleSubmit = async (data: CreditCardExpenseFormValues) => {
    try {
      setIsLoading(true);
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Despesa do cartão criada com sucesso!");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao criar despesa do cartão:", error);
      toast.error("Ocorreu um erro ao criar a despesa. Tente novamente.");
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
  const selectedCard = creditCards.find(
    (c) => c.value === form.watch("cartao")
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          id="descricao"
          placeholder="Ex.: Mercado, Assinatura, App"
          {...form.register("descricao")}
        />
        {form.formState.errors.descricao && (
          <p className="text-sm text-red-500">
            {form.formState.errors.descricao.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2 col-span-2">
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
          <Label htmlFor="parcelas">Parcelas</Label>
          <Select
            onValueChange={(value) => form.setValue("parcelas", parseInt(value))}
            defaultValue={form.watch("parcelas").toString()}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-auto">
              <div className="grid grid-cols-2 gap-0">
                {/* Primeira coluna (1-9) */}
                <div className="flex flex-col">
                  {[...Array(9)].map((_, i) => (
                    <SelectItem
                      key={i + 1}
                      value={(i + 1).toString()}
                      className="w-full justify-center"
                    >
                      {i + 1}x
                    </SelectItem>
                  ))}
                </div>
                
                {/* Segunda coluna (10-18) */}
                <div className="flex flex-col border-l border-border">
                  {[...Array(9)].map((_, i) => {
                    const value = i + 10;
                    return (
                      <SelectItem
                        key={value}
                        value={value.toString()}
                        className="w-full justify-center"
                      >
                        {value}x
                      </SelectItem>
                    );
                  })}
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>
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
        <Label htmlFor="cartao">Cartão de Crédito</Label>
        <Select
          onValueChange={(value) => form.setValue("cartao", value)}
          defaultValue={form.watch("cartao")}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              {selectedCard && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedCard.color }}
                />
              )}
              <SelectValue placeholder="Selecionar cartão" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {creditCards.map((card) => (
              <SelectItem
                key={card.value}
                value={card.value}
                color={card.color}
              >
                {card.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.cartao && (
          <p className="text-sm text-red-500">
            {form.formState.errors.cartao.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fatura">Lançar na Fatura</Label>
        <Select
          onValueChange={(value) => form.setValue("fatura", value)}
          defaultValue={form.watch("fatura")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {invoiceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center w-full gap-2">
                  <span className="flex-grow">{option.label}</span>
                  {option.isCurrent && (
                    <span className="inline-flex items-center justify-center rounded-full border px-1.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] [&>svg]:shrink-0 leading-normal border-transparent [a&]:hover:bg-primary/90 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      Atual
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.fatura && (
          <p className="text-sm text-red-500">
            {form.formState.errors.fatura.message}
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
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Despesa
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
