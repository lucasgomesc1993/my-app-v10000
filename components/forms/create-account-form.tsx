"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Loader2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { toast } from "sonner";
import { ColorPicker } from "@/components/ui/color-picker";

type ContaBancaria = {
  id: string;
  nome: string;
  banco: string;
  tipo: 'corrente' | 'poupança' | 'investimento' | 'outro';
  cor: string;
  saldo: number;
  favorita: boolean;
};

type CreateAccountFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit?: (conta: Omit<ContaBancaria, 'id' | 'favorita'>) => Promise<void> | void;
};

const corPadrao = '#3b82f6';

const accountFormSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome da conta deve ter pelo menos 2 caracteres.",
  }),
  banco: z.string().min(2, {
    message: "O nome do banco deve ter pelo menos 2 caracteres.",
  }),
  tipo: z.string().min(1, "Por favor, selecione um tipo de conta."),
  cor: z.string().min(1, {
    message: "Por favor, selecione uma cor para a conta.",
  }).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Por favor, insira uma cor hexadecimal válida.",
  }),
  saldoInicial: z.string().min(1, "Por favor, insira um valor.").refine(
    (val) => {
      const num = parseFloat(val.replace(/[^0-9,-]+/g, "").replace(",", "."));
      return !isNaN(num);
    },
    {
      message: "Por favor, insira um valor válido.",
    }
  ),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function CreateAccountForm({
  onSuccess,
  onCancel,
  onSubmit,
}: CreateAccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(corPadrao);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      nome: "",
      banco: "",
      tipo: "corrente",
      cor: corPadrao,
      saldoInicial: "0,00",
    },
  });

  const handleSubmit = async (data: AccountFormValues) => {
    try {
      setIsLoading(true);
      
      const saldoInicial = parseFloat(
        data.saldoInicial.replace(/[^0-9,-]+/g, "").replace(",", ".")
      );

      const contaData = {
        nome: data.nome,
        banco: data.banco,
        tipo: data.tipo as 'corrente' | 'poupança' | 'investimento' | 'outro',
        cor: data.cor,
        saldo: saldoInicial,
      };

      if (onSubmit) {
        await onSubmit(contaData);
      }

      toast.success("Conta criada com sucesso!");
      
      if (onSuccess) {
        onSuccess();
      }
      
      form.reset({
        nome: "",
        banco: "",
        tipo: "corrente",
        cor: corPadrao,
        saldoInicial: "0,00",
      });
      
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error("Erro ao criar a conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9,]/g, '');
    
    if (!value) {
      form.setValue("saldoInicial", "");
      return;
    }
    
    value = (parseInt(value.replace(/\D/g, '')) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    form.setValue("saldoInicial", value);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Conta</Label>
        <Input
          id="nome"
          placeholder="Ex: Conta Corrente"
          {...form.register("nome")}
          disabled={isLoading}
        />
        {form.formState.errors.nome && (
          <p className="text-sm text-red-500">
            {form.formState.errors.nome.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="banco">Banco</Label>
        <Input
          id="banco"
          placeholder="Ex: Nubank, Itaú, etc."
          {...form.register("banco")}
          disabled={isLoading}
        />
        {form.formState.errors.banco && (
          <p className="text-sm text-red-500">
            {form.formState.errors.banco.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Conta</Label>
        <Select
          value={form.watch("tipo")}
          onValueChange={(value) => form.setValue("tipo", value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="corrente">Conta Corrente</SelectItem>
            <SelectItem value="poupança">Conta Poupança</SelectItem>
            <SelectItem value="investimento">Conta Investimento</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.tipo && (
          <p className="text-sm text-red-500">
            {form.formState.errors.tipo.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Cor da Conta</Label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full border" 
            style={{ backgroundColor: form.watch("cor") || selectedColor }}
          />
          <Input
            value={form.watch("cor")}
            onChange={(e) => {
              form.setValue("cor", e.target.value);
              setSelectedColor(e.target.value);
            }}
            className="flex-1"
            disabled={isLoading}
          />
        </div>
        <div className="mt-2">
          <ColorPicker 
            value={form.watch("cor") || selectedColor}
            onChange={(color) => {
              form.setValue("cor", color);
              setSelectedColor(color);
            }}
          />
        </div>
        {form.formState.errors.cor && (
          <p className="text-sm text-red-500">
            {form.formState.errors.cor.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="saldoInicial">Saldo Inicial</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            R$&nbsp;
          </span>
          <Input
            id="saldoInicial"
            placeholder="0,00"
            className="pl-12"
            value={form.watch("saldoInicial")}
            onChange={formatCurrency}
            disabled={isLoading}
          />
        </div>
        {form.formState.errors.saldoInicial && (
          <p className="text-sm text-red-500">
            {form.formState.errors.saldoInicial.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Conta
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
