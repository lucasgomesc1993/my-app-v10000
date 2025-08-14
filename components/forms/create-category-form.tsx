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
import { ColorPicker } from "@/components/ui/color-picker";
import { IconPicker } from "@/components/ui/icon-picker";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome da categoria deve ter pelo menos 2 caracteres.",
  }),
  tipo: z.enum(["receita", "despesa", "transferencia"]),
  cor: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
    message: "Cor inválida.",
  }),
  icone: z.string().min(1, {
    message: "Por favor, selecione um ícone.",
  }),
});

type CreateCategoryFormProps = {
  onSuccess?: () => void;
};

export function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: "",
      tipo: "despesa",
      cor: "#9d4edd", // Cor primária do tema (aproximação em hexadecimal de oklch(0.606 0.25 292.717))
      icone: "shopping-cart",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast("Categoria criada com sucesso!", {
        description: `A categoria "${data.nome}" foi criada.`,
      });
      
      // Aqui você pode adicionar a lógica para salvar a categoria no banco de dados
      console.log("Dados do formulário:", data);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      toast.error("Ocorreu um erro ao criar a categoria. Tente novamente.");
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
            
            <button
              type="button"
              onClick={() => form.setValue("tipo", "transferencia")}
              className={cn(
                "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                form.watch("tipo") === "transferencia"
                  ? "border-purple-500/20 bg-purple-500/10 text-purple-800 dark:text-purple-400 hover:bg-purple-500/20"
                  : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Transferência
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
              <Save className="mr-2 h-4 w-4" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Criar categoria
            </>
          )}
        </Button>
      </div>
    </form>
  );
}