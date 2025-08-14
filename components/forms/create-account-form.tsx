"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ColorPicker } from "@/components/ui/color-picker";
import { api } from "@/services/api";
import { Bank, Account } from "@/lib/types";

type CreateAccountFormProps = {
  onSuccess?: () => void;
  onSubmit?: (conta: Omit<Account, 'id' | 'isFavorite' | 'userId' | 'createdAt' | 'updatedAt' | 'balance' | 'initialBalance' | 'bankId' | 'agency' | 'agencyDigit' | 'accountNumber' | 'accountDigit' | 'bankCode' | 'branchId' | 'accountId' | 'ofxAccountType' | 'ofxBankId' | 'ofxBranchId' | 'ofxAccountId' | 'description' | 'syncEnabled' | 'creditLimit' | 'lastSync'> & { saldo: number }) => void;
};

const tiposConta = ["corrente", "poupança", "investimento", "outro"] as const;

const corPadrao = '#3b82f6'; // Cor azul padrão

type TipoConta = typeof tiposConta[number];

const accountFormSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome da conta deve ter pelo menos 2 caracteres.",
  }),
  bancoId: z.string().min(1, "Por favor, selecione um banco."),
  tipo: z.string().min(1, "Por favor, selecione um tipo de conta."),
  cor: z.string().min(1, {
    message: "Por favor, selecione uma cor para a conta.",
  }).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Por favor, insira uma cor hexadecimal válida.",
  }),
  saldoInicial: z.string().refine(
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
  onSubmit,
}: CreateAccountFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(corPadrao);
  const [banks, setBanks] = useState<Bank[]>([]);

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      nome: "",
      bancoId: "",
      tipo: "corrente",
      cor: "#3b82f6", // Cor azul como padrão
      saldoInicial: "0,00",
    },
  });

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const banksData = await api.buscarBancos();
        setBanks(banksData);
      } catch (error) {
        toast.error("Falha ao carregar os bancos.");
      }
    };
    fetchBanks();
  }, []);

  const handleSubmit = async (data: z.infer<typeof accountFormSchema>) => {
    try {
      setIsLoading(true);
      
      // Preparar dados para a API
      const saldoInicial = parseFloat(data.saldoInicial.replace(/[^0-9,-]+/g, "").replace(",", "."));
      
      const contaData = {
        nome: data.nome,
        tipo: data.tipo === 'poupança' ? 'poupanca' : data.tipo as 'corrente' | 'investimento' | 'outro',
        bancoId: data.bancoId,
        saldoInicial: saldoInicial,
      };

      // Chamar a API real para criar a conta
      const contaCriada = await api.criarConta(contaData);
      
      // Se houver um callback de submissão, chama ele com os dados da API
      if (onSubmit) {
        const novaConta = {
          name: contaCriada.name || data.nome,
          bankName: banks.find(b => b.id === data.bancoId)?.name || 'N/A',
          tipo: data.tipo as TipoConta,
          cor: data.cor,
          saldo: contaCriada.balance || saldoInicial,
        };
        onSubmit(novaConta);
      }

      toast.success("Conta criada com sucesso!");
      
      // Limpar o formulário
      form.reset();
      
      // Fecha o diálogo se houver um callback de sucesso
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error("Erro ao criar a conta. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  const formatCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos, incluindo o R$ e espaços
    let value = e.target.value.replace(/[^0-9,]/g, '');
    
    // Se não houver valor, limpa o campo
    if (!value) {
      form.setValue("saldoInicial", "");
      return;
    }
    
    // Converte para número e formata
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
          placeholder="Ex: Conta Principal"
          {...form.register("nome")}
        />
        {form.formState.errors.nome && (
          <p className="text-sm text-red-500">
            {form.formState.errors.nome.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bancoId">Banco</Label>
        <Select
          onValueChange={(value) => form.setValue("bancoId", value)}
          defaultValue={form.watch("bancoId")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o banco" />
          </SelectTrigger>
          <SelectContent>
            {banks.map((bank) => (
              <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.bancoId && (
          <p className="text-sm text-red-500">
            {form.formState.errors.bancoId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Conta</Label>
        <Select
          onValueChange={(value) =>
            form.setValue("tipo", value as AccountFormValues["tipo"])
          }
          defaultValue={form.watch("tipo")}
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

      <div className="grid gap-2">
        <Label htmlFor="cor">Cor da Conta</Label>
        <ColorPicker
          value={form.watch("cor") || selectedColor}
          onChange={(value: string) => {
            form.setValue("cor", value);
            setSelectedColor(value);
          }}
        />
        {form.formState.errors.cor && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.cor.message?.toString()}
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
            className="pl-12"
            value={form.watch("saldoInicial")}
            onChange={formatCurrency}
            placeholder="0,00"
          />
        </div>
        {form.formState.errors.saldoInicial && (
          <p className="text-sm text-red-500">
            {form.formState.errors.saldoInicial.message}
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
              Salvar Conta
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
