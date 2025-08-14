"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock de categorias - substituir por chamada à API
const categorias = [
  { id: "1", nome: "Alimentação", cor: "#EF4444" },
  { id: "2", nome: "Transporte", cor: "#F59E0B" },
  { id: "3", nome: "Moradia", cor: "#3B82F6" },
  { id: "4", nome: "Lazer", cor: "#8B5CF6" },
  { id: "5", nome: "Saúde", cor: "#EC4899" },
  { id: "6", nome: "Educação", cor: "10B981" },
];

const FormSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome do orçamento deve ter pelo menos 2 caracteres.",
  }),
  categoriaId: z.string().min(1, {
    message: "Por favor, selecione uma categoria.",
  }),
  valor: z.string().min(1, {
    message: "Por favor, insira um valor.",
  }),
  periodo: z.enum(["diario", "semanal", "mensal", "anual"]),
});

type CreateBudgetFormProps = {
  onSuccess?: () => void;
};

export function CreateBudgetForm({ onSuccess }: CreateBudgetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: "",
      categoriaId: "",
      valor: "",
      periodo: "mensal",
    },
  });

  const formatCurrency = (value: string) => {
    // Remove todos os caracteres não numéricos
    const onlyNums = value.replace(/\D/g, '');
    
    // Se não houver valor, retorna vazio
    if (onlyNums === '') return '';
    
    // Converte para número e formata como moeda
    const number = Number(onlyNums) / 100;
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast("Orçamento criado com sucesso!", {
        description: `O orçamento "${data.nome}" foi criado.`,
      });
      
      // Aqui você pode adicionar a lógica para salvar o orçamento
      console.log("Dados do orçamento:", data);

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar orçamento:", error);
      toast.error("Ocorreu um erro ao criar o orçamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Orçamento</Label>
        <Input
          id="nome"
          placeholder="Ex.: Mercado do mês"
          {...form.register("nome")}
        />
        {form.formState.errors.nome && (
          <p className="text-sm text-red-500">
            {form.formState.errors.nome.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoriaId">Categoria</Label>
        <Select
          onValueChange={(value) => form.setValue("categoriaId", value)}
          defaultValue={form.watch("categoriaId")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((categoria) => (
              <SelectItem key={categoria.id} value={categoria.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: categoria.cor }}
                  />
                  {categoria.nome}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.categoriaId && (
          <p className="text-sm text-red-500">
            {form.formState.errors.categoriaId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor">Valor</Label>
        <Input
          id="valor"
          placeholder="R$ 0,00"
          value={form.watch("valor")}
          onChange={(e) => {
            // Remove todos os caracteres não numéricos
            const onlyNums = e.target.value.replace(/\D/g, '');
            
            // Se não houver valor, limpa o campo
            if (onlyNums === '') {
              form.setValue("valor", "");
              return;
            }
            
            // Formata como moeda
            const formattedValue = formatCurrency(onlyNums);
            form.setValue("valor", formattedValue);
          }}
        />
        {form.formState.errors.valor && (
          <p className="text-sm text-red-500">
            {form.formState.errors.valor.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Período</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "diario", label: "Diário" },
            { value: "semanal", label: "Semanal" },
            { value: "mensal", label: "Mensal" },
            { value: "anual", label: "Anual" },
          ].map((periodo) => (
            <Button
              key={periodo.value}
              type="button"
              variant={form.watch("periodo") === periodo.value ? "default" : "outline"}
              size="sm"
              onClick={() => form.setValue("periodo", periodo.value as any)}
            >
              {periodo.label}
            </Button>
          ))}
        </div>
        {form.formState.errors.periodo && (
          <p className="text-sm text-red-500">
            {form.formState.errors.periodo.message}
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
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Criar orçamento
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
