"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/services/api";

import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ColorPicker } from "@/components/ui/color-picker";
import { IconPicker } from "@/components/ui/icon-picker";
import { cn } from "@/lib/utils";
import type { Categoria } from "@/types/index";

const FormSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome da categoria deve ter pelo menos 2 caracteres.",
  }),
  tipo: z.enum(["receita", "despesa"]),
  cor: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
    message: "Cor inválida.",
  }),
  icone: z.string().min(1, {
    message: "Por favor, selecione um ícone.",
  }),
  descricao: z.string().optional(),
});

type CreateCategoryFormProps = {
  onSuccess?: () => void;
  categoryToEdit?: Categoria;
};

export function CreateCategoryForm({ onSuccess, categoryToEdit }: CreateCategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!categoryToEdit;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: "",
      tipo: "despesa",
      cor: "#9d4edd",
      icone: "shopping-cart",
      descricao: "",
    },
  });

  // Preencher o formulário com os dados da categoria a ser editada
  useEffect(() => {
    if (categoryToEdit) {
      // Garantir que o tipo seja 'receita' ou 'despesa'
      const tipo = (categoryToEdit.tipo === 'receita' || categoryToEdit.type === 'receita') 
        ? 'receita' 
        : 'despesa';
        
      form.reset({
        nome: categoryToEdit.nome || categoryToEdit.name || "",
        tipo,
        cor: categoryToEdit.cor || categoryToEdit.color || "#9d4edd",
        icone: categoryToEdit.icone || categoryToEdit.icon || "shopping-cart",
        descricao: categoryToEdit.description || "", // Usando description da API
      });
    }
  }, [categoryToEdit, form]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    try {
      console.log('Iniciando envio do formulário com dados:', formData);
      setIsLoading(true);
      
      // Preparar os dados para a API
      const categoriaData = {
        nome: formData.nome,
        tipo: formData.tipo,
        cor: formData.cor,
        icone: formData.icone,
        descricao: formData.descricao || ''
      };
      
      console.log('Dados formatados para a API:', categoriaData);
      
      try {
        if (isEditMode && categoryToEdit?.id) {
          // Modo de edição
          console.log('Atualizando categoria existente...');
          const categoriaAtualizada = await api.editarCategoria(
            String(categoryToEdit.id), 
            categoriaData
          );
          
          console.log('Resposta da API (edição):', categoriaAtualizada);
          
          toast.success("Categoria atualizada com sucesso!", {
            description: `A categoria "${formData.nome}" foi atualizada.`,
          });
        } else {
          // Modo de criação
          console.log('Criando nova categoria...');
          const novaCategoria = await api.criarCategoria(categoriaData);
          console.log('Resposta da API (criação):', novaCategoria);
          
          toast.success("Categoria criada com sucesso!", {
            description: `A categoria "${formData.nome}" foi criada.`,
          });
        }
        
        // Chamar a função de sucesso para fechar o diálogo e atualizar a lista
        if (onSuccess) {
          console.log('Chamando onSuccess callback...');
          onSuccess();
        }
      } catch (apiError) {
        console.error('Erro na chamada da API:', apiError);
        throw apiError; // Re-lança o erro para ser capturado pelo catch externo
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      toast.error(
        `Erro ao criar a categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          placeholder="Digite o nome da categoria"
          {...form.register("nome")}
        />
        {form.formState.errors.nome && (
          <p className="text-sm text-red-500">
            {form.formState.errors.nome.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex items-center gap-2">
          <ColorPicker
            value={form.watch("cor")}
            onChange={(value: string) => form.setValue("cor", value)}
            className="w-full"
          />
        </div>
        {form.formState.errors.cor && (
          <p className="text-sm text-red-500">
            {form.formState.errors.cor.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Ícone</Label>
        <IconPicker
          value={form.watch("icone")}
          onChange={(value) => form.setValue("icone", value)}
          color={form.watch("cor")} // Passando a cor selecionada para o IconPicker
        />
        {form.formState.errors.icone && (
          <p className="text-sm text-red-500">
            {form.formState.errors.icone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo</Label>
        <div className="mt-1">
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => form.setValue("tipo", "despesa")}
              className={cn(
                "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                form.watch("tipo") === "despesa"
                  ? "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Despesa
            </button>
            
            <button
              type="button"
              onClick={() => form.setValue("tipo", "receita")}
              className={cn(
                "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                form.watch("tipo") === "receita"
                  ? "border-green-500/20 bg-green-500/10 text-green-800 dark:text-green-400 hover:bg-green-500/20"
                  : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Receita
            </button>
          </div>
        </div>
        {form.formState.errors.tipo && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.tipo.message}
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? 'Salvando...' : 'Criando...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'Salvar alterações' : 'Criar categoria'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}