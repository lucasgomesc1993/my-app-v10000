"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { CreditCard, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/services/api";
import { ColorPicker } from "@/components/ui/color-picker";
import { NewCreditCard } from "@/lib/types";

type CreateCreditCardFormProps = {
  onSuccess?: () => void;
  onSubmit?: (cartao: NewCreditCard) => void;
};

const bandeiras = ["visa", "mastercard", "elo", "outro"] as const;


const corPadrao = '#3b82f6'; // Cor azul padrão

type Bandeira = typeof bandeiras[number];


const creditCardFormSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome do cartão deve ter pelo menos 2 caracteres.",
  }),
  bandeira: z.string().min(1, "Por favor, selecione a bandeira do cartão."),
  banco: z.string().optional(),
  cor: z.string().min(1, {
    message: "Por favor, selecione uma cor para o cartão.",
  }).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Por favor, insira uma cor hexadecimal válida.",
  }),
  limite: z.string().refine(
    (val) => {
      const num = parseFloat(val.replace(/[^0-9,-]+/g, "").replace(",", "."));
      return !isNaN(num) && num > 0;
    },
    {
      message: "Por favor, insira um valor válido para o limite.",
    }
  ),
  fechamento: z.number()
    .min(1, "O dia de fechamento deve ser entre 1 e 31.")
    .max(31, "O dia de fechamento deve ser entre 1 e 31."),
  vencimento: z.number()
    .min(1, "O dia de vencimento deve ser entre 1 e 31.")
    .max(31, "O dia de vencimento deve ser entre 1 e 31."),
});

type CreditCardFormValues = z.infer<typeof creditCardFormSchema>;

export function CreateCreditCardForm({
  onSuccess,
  onSubmit,
}: CreateCreditCardFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(corPadrao);

  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardFormSchema),
    defaultValues: {
      nome: "",
      bandeira: "visa",
      banco: "",
      cor: "#3b82f6", // Cor azul como padrão
      limite: "0,00",
      fechamento: 10,
      vencimento: 20,
    },
  });

  const handleSubmit = async (data: CreditCardFormValues) => {
    try {
      setIsLoading(true);
      
      const novoCartao: Omit<NewCreditCard, 'userId' | 'lastFourDigits'> = {
        name: data.nome,
        brand: data.bandeira as Bandeira,
        // bancoId: data.bancoId, // Adicionar seleção de banco se necessário
        cor: data.cor,
        creditLimit: parseFloat(data.limite.replace(".", "").replace(",", ".")),
        closingDay: data.fechamento,
        dueDay: data.vencimento,
        type: 'credito', // ou outro tipo padrão
      };

      // Adicionar lastFourDigits se for um campo no formulário
      // novoCartao.lastFourDigits = '1234';

      await api.criarCartao(novoCartao as NewCreditCard);

      // Se houver um callback de submissão, chama ele
      if (onSubmit) {
        onSubmit(novoCartao);
      }

      toast.success("Cartão criado com sucesso!");
      
      // Fecha o diálogo se houver um callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao criar cartão:", error);
      toast.error("Ocorreu um erro ao criar o cartão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9,]/g, '');
    
    if (!value) {
      form.setValue("limite", "");
      return;
    }
    
    // Formata como moeda brasileira
    value = (parseInt(value.replace(/\D/g, '')) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    form.setValue("limite", value);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Cartão</Label>
        <Input
          id="nome"
          placeholder="Ex: Nubank Visa, Itaú Mastercard, etc."
          {...form.register("nome")}
        />
        {form.formState.errors.nome && (
          <p className="text-sm text-red-500">
            {form.formState.errors.nome.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bandeira">Bandeira</Label>
          <Select
            onValueChange={(value) =>
              form.setValue("bandeira", value as CreditCardFormValues["bandeira"])
            }
            defaultValue={form.watch("bandeira")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a bandeira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="mastercard">Mastercard</SelectItem>
              <SelectItem value="elo">Elo</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.bandeira && (
            <p className="text-sm text-red-500">
              {form.formState.errors.bandeira.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="banco">Banco</Label>
            <span className="text-xs text-muted-foreground">(opcional)</span>
          </div>
          <Input
            id="banco"
            placeholder="Ex: Itaú"
            {...form.register("banco")}
          />
          {form.formState.errors.banco && (
            <p className="text-sm text-red-500">
              {form.formState.errors.banco.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="limite">Limite do Cartão</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            R$&nbsp;
          </span>
          <Input
            id="limite"
            className="pl-12"
            value={form.watch("limite")}
            onChange={formatCurrency}
            placeholder="0,00"
          />
        </div>
        {form.formState.errors.limite && (
          <p className="text-sm text-red-500">
            {form.formState.errors.limite.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechamento">Dia de Fechamento</Label>
          <Input
            id="fechamento"
            type="number"
            min="1"
            max="31"
            {...form.register("fechamento", { valueAsNumber: true })}
          />
          {form.formState.errors.fechamento && (
            <p className="text-sm text-red-500">
              {form.formState.errors.fechamento.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vencimento">Dia de Vencimento</Label>
          <Input
            id="vencimento"
            type="number"
            min="1"
            max="31"
            {...form.register("vencimento", { valueAsNumber: true })}
          />
          {form.formState.errors.vencimento && (
            <p className="text-sm text-red-500">
              {form.formState.errors.vencimento.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cor do Cartão</Label>
        <ColorPicker
          value={form.watch("cor") || selectedColor}
          onChange={(value: string) => {
            setSelectedColor(value);
            form.setValue("cor", value);
          }}
        />
        {form.formState.errors.cor && (
          <p className="text-sm text-red-500">
            {form.formState.errors.cor.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Salvando...
            </span>
          ) : (
            <span className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Salvar Cartão
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
