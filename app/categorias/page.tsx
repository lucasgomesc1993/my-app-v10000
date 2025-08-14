"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/card";
import { Categoria, TipoTransacao } from "@/types";
import { CreateCategoryDialog } from "@/components/dialogs/create-category-dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/services/api";
import { AddCategoryButton } from "@/components/add-category-button";

// Mapeamento de ícones para cada tipo de transação
const iconesPorTipo: Record<string, string> = {
  receita: "trending-up",
  despesa: "trending-down",
  transferencia: "arrow-left-right"
};

// Cores de fundo para os badges de tipo
const coresBadgePorTipo: Record<TipoTransacao, string> = {
  receita: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  despesa: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  transferencia: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Função para normalizar os dados da categoria
  const normalizarCategoria = (categoria: Categoria): Categoria => {
    return {
      ...categoria,
      // Garante que o ID seja uma string
      id: String(categoria.id),
      // Usa os campos em inglês se os em português não estiverem disponíveis
      nome: categoria.nome || categoria.name || 'Sem nome',
      cor: categoria.cor || categoria.color || '#9d4edd',
      tipo: categoria.tipo || categoria.type || 'despesa',
      icone: categoria.icone || categoria.icon || 'tag'
    };
  };

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const categoriasData = await api.buscarCategorias();
      // Normaliza os dados antes de definir o estado
      const categoriasNormalizadas = categoriasData.map(normalizarCategoria);
      setCategorias(categoriasNormalizadas);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const [categoriaParaEditar, setCategoriaParaEditar] = useState<Categoria | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleEditarCategoria = (categoria: Categoria, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoriaParaEditar(categoria);
    setDialogAberto(true);
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setCategoriaParaEditar(null);
  };

  const handleSucessoCategoria = () => {
    carregarCategorias();
    handleFecharDialog();
  };

  const handleExcluirCategoria = async (categoria: Categoria, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}"?`)) {
      try {
        // Garante que o ID seja uma string
        await api.excluirCategoria(String(categoria.id));
        toast.success("Categoria excluída com sucesso!");
        carregarCategorias(); // Recarregar lista após exclusão
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        toast.error("Erro ao excluir categoria");
      }
    }
  };

  // Função para obter o componente do ícone dinamicamente
  const getIconComponent = (iconName: string) => {
    try {
      if (!iconName) return require('lucide-react').Tag;
      
      // Remove o prefixo 'lucide:' se existir
      const cleanIconName = iconName.replace('lucide:', '');
      
      // Converte o nome do ícone para o formato PascalCase que o Lucide usa
      const formattedName = cleanIconName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      
      // Tenta importar o ícone dinamicamente
      const lucideIcons = require('lucide-react');
      const IconComponent = lucideIcons[formattedName] || lucideIcons.Tag;
      
      return IconComponent;
    } catch (error) {
      console.error(`Erro ao carregar o ícone ${iconName}:`, error);
      return require('lucide-react').Tag;
    }
  };

  // Função para obter o nome do ícone de forma consistente
  const getIconName = (categoria: Categoria) => {
    // Tenta obter o ícone em português, depois em inglês, depois o padrão para o tipo
    const iconName = categoria.icone || categoria.icon || iconesPorTipo[categoria.tipo as TipoTransacao] || "tag";
    // Remove o prefixo 'lucide:' se existir para manter consistência
    return iconName.replace('lucide:', '');
  };

  if (loading) {
    return (
      <PageLayout title="Categorias">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando categorias...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Categorias"
      actionButtons={
        <AddCategoryButton onCategoryCreated={carregarCategorias} />
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Diálogo de edição */}
        <CreateCategoryDialog 
          open={dialogAberto} 
          onOpenChange={(open: boolean) => !open && handleFecharDialog()}
          categoryToEdit={categoriaParaEditar}
          onCategoryCreated={handleSucessoCategoria}
        />
        {categorias.map((categoria) => {
                  // Obtém o nome do ícone
                  const iconName = getIconName(categoria);
                  // Obtém o componente do ícone
                  const Icone = getIconComponent(iconName);
                  
                  // Já normalizamos os dados, então podemos usar o campo 'cor' diretamente
                  const iconColor = categoria.cor;
                  
                  return (
                    <div 
                      key={categoria.id}
                      className={cn(
                        "relative border border-border/50 bg-card text-card-foreground shadow-sm rounded-sm transition-all duration-200 hover:shadow-md hover:border-border/80",
                        "group hover:-translate-y-1"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-11 h-11 rounded-lg flex items-center justify-center"
                              style={{ 
                                backgroundColor: `${iconColor}20`,
                                color: iconColor
                              }}
                            >
                              <Icone className="w-5 h-5" style={{ color: 'inherit' }} />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{categoria.nome}</h3>
                              <Badge 
                                className={cn(
                                  "mt-1 text-xs capitalize",
                                  coresBadgePorTipo[categoria.tipo as TipoTransacao]
                                )}
                              >
                                {categoria.tipo}
                              </Badge>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem 
                                onClick={(e) => handleEditarCategoria(categoria, e)}
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => handleExcluirCategoria(categoria, e)}
                                className="text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
      </div>
    </PageLayout>
  );
}