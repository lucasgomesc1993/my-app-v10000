"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Palette } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categorySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["receita", "despesa", "transferencia"] as const),
  cor: z.string().min(1, "Cor é obrigatória"),
  icone: z.string().min(1, "Ícone é obrigatório"),
});

type CategoryForm = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  nome: string;
  tipo: "receita" | "despesa" | "transferencia";
  cor: string;
  icone: string;
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSave: (data: CategoryForm) => Promise<void>;
}

// Cores disponíveis para categorias
const availableColors = [
  { name: "Azul", value: "blue", class: "bg-blue-500" },
  { name: "Verde", value: "green", class: "bg-green-500" },
  { name: "Vermelho", value: "red", class: "bg-red-500" },
  { name: "Amarelo", value: "yellow", class: "bg-yellow-500" },
  { name: "Roxo", value: "purple", class: "bg-purple-500" },
  { name: "Rosa", value: "pink", class: "bg-pink-500" },
  { name: "Laranja", value: "orange", class: "bg-orange-500" },
  { name: "Cinza", value: "gray", class: "bg-gray-500" },
];

// Ícones disponíveis para categorias
const availableIcons = [
  { name: "Dinheiro", value: "DollarSign", icon: LucideIcons.DollarSign },
  { name: "Casa", value: "Home", icon: LucideIcons.Home },
  { name: "Carro", value: "Car", icon: LucideIcons.Car },
  { name: "Comida", value: "UtensilsCrossed", icon: LucideIcons.UtensilsCrossed },
  { name: "Compras", value: "ShoppingCart", icon: LucideIcons.ShoppingCart },
  { name: "Saúde", value: "Heart", icon: LucideIcons.Heart },
  { name: "Educação", value: "GraduationCap", icon: LucideIcons.GraduationCap },
  { name: "Lazer", value: "Gamepad2", icon: LucideIcons.Gamepad2 },
  { name: "Viagem", value: "Plane", icon: LucideIcons.Plane },
  { name: "Trabalho", value: "Briefcase", icon: LucideIcons.Briefcase },
  { name: "Investimento", value: "TrendingUp", icon: LucideIcons.TrendingUp },
  { name: "Presente", value: "Gift", icon: LucideIcons.Gift },
];

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      tipo: "despesa",
      cor: "blue",
      icone: "DollarSign",
    },
  });

  const watchedCor = watch("cor");
  const watchedIcone = watch("icone");
  const watchedNome = watch("nome");

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          nome: category.nome,
          tipo: category.tipo,
          cor: category.cor,
          icone: category.icone,
        });
      } else {
        reset({
          nome: "",
          tipo: "despesa",
          cor: "blue",
          icone: "DollarSign",
        });
      }
    }
  }, [open, category, reset]);

  const onSubmit = async (data: CategoryForm) => {
    try {
      setIsLoading(true);
      await onSave(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      orange: "bg-orange-500",
      gray: "bg-gray-500",
    };
    return colorMap[color] || "bg-blue-500";
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      DollarSign: LucideIcons.DollarSign,
      Home: LucideIcons.Home,
      Car: LucideIcons.Car,
      UtensilsCrossed: LucideIcons.UtensilsCrossed,
      ShoppingCart: LucideIcons.ShoppingCart,
      Heart: LucideIcons.Heart,
      GraduationCap: LucideIcons.GraduationCap,
      Gamepad2: LucideIcons.Gamepad2,
      Plane: LucideIcons.Plane,
      Briefcase: LucideIcons.Briefcase,
      TrendingUp: LucideIcons.TrendingUp,
      Gift: LucideIcons.Gift,
    };
    return iconMap[iconName] || LucideIcons.DollarSign;
  };

  const IconComponent = getIconComponent(watchedIcone);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Altere os dados da categoria abaixo."
              : "Preencha os dados para criar uma nova categoria."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Preview da categoria */}
          {watchedNome && (
            <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg text-white",
                  getColorClass(watchedCor)
                )}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{watchedNome}</p>
                  <Badge variant="secondary" className="text-xs">
                    {watch("tipo")}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Ex: Alimentação"
                {...register("nome")}
                className={cn(errors.nome && "border-destructive")}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={watch("tipo")}
                onValueChange={(value: "receita" | "despesa" | "transferencia") => 
                  setValue("tipo", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-sm text-destructive">{errors.tipo.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-4 gap-2">
              {availableColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setValue("cor", color.value)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border-2 transition-colors",
                    watchedCor === color.value
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:border-muted-foreground/20"
                  )}
                >
                  <div className={cn("w-4 h-4 rounded", color.class)} />
                  <span className="text-xs font-medium">{color.name}</span>
                </button>
              ))}
            </div>
            {errors.cor && (
              <p className="text-sm text-destructive">{errors.cor.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
              {availableIcons.map((icon) => {
                const IconComp = icon.icon;
                return (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => setValue("icone", icon.value)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border-2 transition-colors",
                      watchedIcone === icon.value
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:border-muted-foreground/20"
                    )}
                  >
                    <IconComp className="h-4 w-4" />
                    <span className="text-xs font-medium">{icon.name}</span>
                  </button>
                );
              })}
            </div>
            {errors.icone && (
              <p className="text-sm text-destructive">{errors.icone.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                isEditing ? "Salvar Alterações" : "Criar Categoria"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
