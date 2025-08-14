"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, X, Landmark } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { z } from "zod";

// Schema de validação
const accountFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  banco: z.string().min(1, "Banco é obrigatório"),
  bancoId: z.string().optional(),
  tipo: z.enum(["corrente", "poupanca", "investimento", "outro"]),
  cor: z.string().min(1, "Cor é obrigatória"),
  saldoInicial: z.string().min(1, "Saldo inicial é obrigatório"),
  agencia: z.string().optional(),
  numeroConta: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountFormSchema>;

interface EditAccountFormProps {
  account: {
    id: string;
    name: string;
    bankName?: string;
    bankId?: string | number;
    type: 'corrente' | 'poupanca' | 'investimento' | 'outro';
    balance: number;
    color?: string;
    agency?: string;
    accountNumber?: string;
  };
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
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [selectedColor, setSelectedColor] = useState(account.color || "#3b82f6");
  
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      nome: account.name || "",
      banco: account.bankName || "",
      bancoId: account.bankId ? String(account.bankId) : "",
      tipo: account.type || "corrente",
      cor: account.color || "#3b82f6",
      saldoInicial: account.balance ? account.balance.toFixed(2).replace('.', ',') : "0,00",
      agencia: account.agency || "",
      numeroConta: account.accountNumber || "",
    },
  });
  
  const handleSubmit = async (data: AccountFormData) => {
    try {
      setIsLoading(true);
      
      // Converter o saldo para número
      const saldoInicial = parseFloat(data.saldoInicial.replace(/\./g, '').replace(',', '.'));
      
      // Aqui você pode adicionar a lógica para salvar as alterações
      // Por exemplo:
      // await api.atualizarConta(account.id, {
      //   ...data,
      //   balance: saldoInicial,
      //   color: selectedColor,
      // });
      
      toast.success("Conta atualizada com sucesso!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
      toast.error("Erro ao atualizar a conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Buscar lista de bancos (exemplo)
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoadingBanks(true);
        // Exemplo: const response = await api.getBanks();
        // setBanks(response.data);
      } catch (error) {
        console.error("Erro ao carregar bancos:", error);
        toast.error("Não foi possível carregar a lista de bancos");
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  const handleCancel = () => {
    if (onCancel) onCancel();
    if (onClose) onClose();
  };
  // Função para formatar moeda
  const formatCurrency = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Se não tiver valor, retorna vazio
    if (!digits) return '0,00';
    
    // Converte para número e formata como moeda
    const numberValue = parseInt(digits, 10) / 100;
    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Mapeia o tipo da conta para o formato esperado
  const mapAccountType = (type: string) => {
    switch (type) {
      case 'corrente':
      case 'poupanca':
      case 'investimento':
        return type;
      default:
        return 'outro';
    }
  };

  // Manipulador de mudança de cor
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    form.setValue('cor', color);
  };

  // Manipulador de mudança de moeda
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    form.setValue('saldoInicial', formatted);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Conta</Label>
        <Input
          id="nome"
          placeholder="Ex: Conta Corrente Principal"
          {...form.register("nome")}
          disabled={isLoading}
        />
        {form.formState.errors.nome && (
          <p className="text-sm text-red-500">{form.formState.errors.nome.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="banco">Banco</Label>
        <Input
          id="banco"
          placeholder="Ex: Nubank, Itaú, Bradesco"
          {...form.register("banco")}
          disabled={isLoading}
        />
        {form.formState.errors.banco && (
          <p className="text-sm text-red-500">{form.formState.errors.banco.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Conta</Label>
        <Select
          value={form.watch("tipo")}
          onValueChange={(value) => form.setValue("tipo", value as any)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="corrente">Conta Corrente</SelectItem>
            <SelectItem value="poupanca">Conta Poupança</SelectItem>
            <SelectItem value="investimento">Conta Investimento</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.tipo && (
          <p className="text-sm text-red-500">{form.formState.errors.tipo.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full border" 
            style={{ backgroundColor: selectedColor }}
          />
          <Input
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
        </div>
        <div className="mt-2">
          <ColorPicker 
            color={selectedColor}
            onChange={handleColorChange}
            value={selectedColor}
          />
        </div>
        {form.formState.errors.cor && (
          <p className="text-sm text-red-500">{form.formState.errors.cor.message}</p>
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
            onChange={handleCurrencyChange}
            disabled={isLoading}
          />
        </div>
        {form.formState.errors.saldoInicial && (
          <p className="text-sm text-red-500">{form.formState.errors.saldoInicial.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agencia">Agência (opcional)</Label>
        <Input
          id="agencia"
          placeholder="Número da agência"
          {...form.register("agencia")}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeroConta">Número da Conta (opcional)</Label>
        <Input
          id="numeroConta"
          placeholder="Número da conta"
          {...form.register("numeroConta")}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
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
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
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
