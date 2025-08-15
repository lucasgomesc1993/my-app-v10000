"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ColorPicker } from "@/components/ui/color-picker";
import { IconPicker } from "@/components/ui/icon-picker";
import { cn } from "@/lib/utils";
import { categoryFormSchema, type CategoryFormSchema } from "@/lib/utils/validators";
import { createOrUpdateCategory } from "@/category-actions";

const FormSchema = categoryFormSchema;

type CreateCategoryFormProps = {
  onSuccess?: () => void;
  categoryToEdit?: CategoryFormSchema & { id: string };
};

export function CreateCategoryForm({ onSuccess, categoryToEdit }: CreateCategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!categoryToEdit;

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: "",
      tipo: "despesa",
      cor: "#9d4edd",
      icone: "shopping-cart",
      descricao: "",
    },
  });

  // Atualiza os valores do formulário quando categoryToEdit mudar
  useEffect(() => {
    if (categoryToEdit) {
      form.reset(categoryToEdit);
    }
  }, [categoryToEdit, form]);

  async function onSubmit(data: CategoryFormSchema) {
    setIsLoading(true);
    try {
      if (isEditMode && categoryToEdit?.id) {
        // Modo de edição
        console.log('Atualizando categoria existente...');
        const categoriaAtualizada = await createOrUpdateCategory(
          categoryToEdit.id, 
          data
        );
        
        toast.success("Categoria atualizada com sucesso!", {
          description: `A categoria ${data.nome} foi atualizada.`,
        });
      } else {
        // Modo de criação
        console.log('Criando nova categoria...');
        const novaCategoria = await createOrUpdateCategory(data);
        
        toast.success("Categoria criada com sucesso!", {
          description: `A categoria ${data.nome} foi criada.`,
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Erro ao salvar categoria", {
        description: "Ocorreu um erro ao salvar a categoria. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome da Categoria</Label>
          <Input
            id="nome"
            placeholder="Ex: Alimentação"
            {...form.register("nome")}
            disabled={isLoading}
          />
          {form.formState.errors.nome && (
            <p className="text-sm text-red-500">
              {form.formState.errors.nome.message}
            </p>
          )}
        </div>

        <div>
          <Label>Tipo</Label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => form.setValue("tipo", "receita")}
              className={cn(
                "flex-1 py-2 px-4 rounded-md border",
                form.watch("tipo") === "receita"
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "border-gray-300"
              )}
              disabled={isLoading}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => form.setValue("tipo", "despesa")}
              className={cn(
                "flex-1 py-2 px-4 rounded-md border",
                form.watch("tipo") === "despesa"
                  ? "bg-red-100 border-red-500 text-red-700"
                  : "border-gray-300"
              )}
              disabled={isLoading}
            >
              Despesa
            </button>
          </div>
          {form.formState.errors.tipo && (
            <p className="mt-1 text-sm text-red-500">
              {form.formState.errors.tipo.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cor">Cor</Label>
            <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
              <ColorPicker
                value={form.watch("cor")}
                onChange={(cor) => form.setValue("cor", cor)}
              />
            </div>
            {form.formState.errors.cor && (
              <p className="text-sm text-red-500">
                {form.formState.errors.cor.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="icone">Ícone</Label>
            <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
              <IconPicker
                value={form.watch("icone")}
                onChange={(icone) => form.setValue("icone", icone)}
              />
            </div>
            {form.formState.errors.icone && (
              <p className="text-sm text-red-500">
                {form.formState.errors.icone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="descricao">Descrição (opcional)</Label>
          <Input
            id="descricao"
            placeholder="Adicione uma descrição para a categoria"
            {...form.register("descricao")}
            disabled={isLoading}
          />
          {form.formState.errors.descricao && (
            <p className="text-sm text-red-500">
              {form.formState.errors.descricao.message}
            </p>
          )}
        </div>
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