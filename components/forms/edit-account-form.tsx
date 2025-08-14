"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, X, Landmark } from "lucide-react";
import { toast } from "sonner";

// Components
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";

// Utils
import { formatCurrency, parseCurrency } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

// Services
import { api } from "@/services/api";

// Types
import { Account, Bank } from "@/lib/types";
import { accountSchema, AccountFormData } from "@/lib/utils/validators";

// Opções de tipo de conta
const accountTypeOptions = [
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupança', label: 'Poupança' },
  { value: 'investimento', label: 'Investimento' },
  { value: 'outro', label: 'Outro' },
] as const;

interface EditAccountFormProps {
  account: Account;
  onSuccess?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function EditAccountForm({ 
  account, 
  onSuccess, 
  onCancel,
  onClose
}: EditAccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedColor, setSelectedColor] = useState(account.color || "#3b82f6");

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account.name || "",
      bankId: account.bankId ? account.bankId.toString() : "",
      type: account.type || "corrente",
      color: account.color || "#3b82f6",
      initialBalance: account.balance ? formatCurrency(account.balance.toString()) : "0,00",
      agency: account.agency || "",
      accountNumber: account.accountNumber || "",
    },
  });

  // Buscar lista de bancos
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const banksData = await api.buscarBancos();
        setBanks(banksData);
      } catch (error) {
        console.error("Erro ao carregar bancos:", error);
        toast.error("Não foi possível carregar a lista de bancos");
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  // Atualizar a cor selecionada quando o valor do formulário mudar
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'color' && value.color) {
        setSelectedColor(value.color);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Buscar lista de bancos
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const banksData = await api.buscarBancos();
        setBanks(banksData);
      } catch (error) {
        console.error("Erro ao carregar bancos:", error);
        toast.error("Não foi possível carregar a lista de bancos");
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  const onSubmit = async (formData: AccountFormData) => {
    try {
      setIsLoading(true);
      
      // Validação adicional do formulário
      const validationResult = await form.trigger();
      if (!validationResult) {
        toast.error("Por favor, preencha todos os campos obrigatórios corretamente.");
        return;
      }
      
      // Validar se o banco foi selecionado
      if (!formData.bankId) {
        toast.error("Selecione um banco");
        return;
      }
      
      // Validar cor (deve ser um código de cor hexadecimal válido)
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.color)) {
        toast.error("Selecione uma cor válida");
        return;
      }

      // Converter valores formatados para número
      const saldoInicial = parseCurrency(formData.initialBalance || '0');
      
      // Mapear os tipos do formulário para os tipos da API
      const mapAccountType = (type: string): 'corrente' | 'poupanca' | 'investimento' => {
        switch (type) {
          case 'poupanca':
          case 'investimento':
            return type;
          case 'outro':
          default:
            return 'corrente';
        }
      };
      
      // Preparar dados para a API usando os nomes de campo corretos
      const accountData = {
        nome: formData.name,
        bancoId: formData.bankId,
        tipo: mapAccountType(formData.type),
        saldoInicial: saldoInicial,
        agencia: formData.agency || '',
        conta: formData.accountNumber || '',
      };
      
      // Chamar a API para atualizar a conta
      const response = await api.editarConta(account.id, accountData);
      
      if (response) {
        toast.success("Conta atualizada com sucesso!");
        
        // Chamar callback de sucesso se fornecido
        if (onSuccess) {
          onSuccess();
        }
        
        // Fechar o diálogo se houver um manipulador de fechamento
        if (onClose) {
          onClose();
        }
      } else {
        throw new Error("Não foi possível atualizar a conta. Tente novamente.");
      }
      
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
      toast.error(
        error instanceof Error 
          ? `Erro ao atualizar conta: ${error.message}` 
          : "Ocorreu um erro ao atualizar a conta. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Função para formatar o valor monetário enquanto digita
  const handleCurrencyChange = (field: 'initialBalance') => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value === '') {
      form.setValue(field, '');
      return;
    }
    
    // Converte para número e formata como moeda
    const numberValue = parseInt(value, 10) / 100;
    const formattedValue = numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    form.setValue(field, formattedValue);
  };

  // Função para lidar com a seleção de cor
  const handleColorChange = (color: string) => {
    form.setValue('color', color);
    setSelectedColor(color);
  };

  // Função para cancelar a edição
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Conta</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankId">Banco</Label>
        <Select
          onValueChange={(value) => form.setValue("bankId", value)}
          value={form.watch("bankId")}
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
        {form.formState.errors.bankId && (
          <p className="text-sm text-red-500">{form.formState.errors.bankId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Conta</Label>
        <Select
          value={form.watch("type")}
          onValueChange={(value) => form.setValue("type", value as 'corrente' | 'poupanca' | 'investimento' | 'outro')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="corrente">Conta Corrente</SelectItem>
            <SelectItem value="poupança">Poupança</SelectItem>
            <SelectItem value="investimento">Investimento</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.type && (
          <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full border"
            style={{ backgroundColor: selectedColor }}
          />
          <Input 
            id="color" 
            value={selectedColor} 
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-24"
          />
        </div>
        {form.formState.errors.color && (
          <p className="text-sm text-red-500">{form.formState.errors.color.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="initialBalance">Saldo Inicial</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            R$&nbsp;
          </span>
          <Input 
            id="initialBalance" 
            className="pl-12" 
            value={formatCurrency(parseFloat(form.watch("initialBalance") || '0') || 0)}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              form.setValue("initialBalance", value ? (Number(value) / 100).toFixed(2) : '0');
            }}
          />
        </div>
        {form.formState.errors.initialBalance && (
          <p className="text-sm text-red-500">{form.formState.errors.initialBalance.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel || onClose} 
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="min-w-[120px]"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </span>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
