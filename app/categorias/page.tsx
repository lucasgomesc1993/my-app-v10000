"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/card";
import { CategoryDialog } from "@/components/dialogs/category-dialog";
import { Categoria, TipoTransacao } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/badge";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for categories
const data: Categoria[] = [
  { id: "1", nome: "Salário", tipo: "receita", cor: "#10B981", icone: "dollar-sign" },
  { id: "2", nome: "Alimentação", tipo: "despesa", cor: "#EF4444", icone: "utensils" },
  { id: "3", nome: "Transporte", tipo: "despesa", cor: "#F59E0B", icone: "car" },
  { id: "4", nome: "Moradia", tipo: "despesa", cor: "#3B82F6", icone: "home" },
  { id: "5", nome: "Lazer", tipo: "despesa", cor: "#8B5CF6", icone: "film" },
  { id: "6", nome: "Transferência", tipo: "transferencia", cor: "#8B5CF6", icone: "arrow-left-right" },
];

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
  const [categorias, setCategorias] = useState<Categoria[]>(data);
  
  const handleEditarCategoria = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Editar categoria:", id);
  };

  const handleExcluirCategoria = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      setCategorias(prevCategorias => 
        prevCategorias.filter(cat => cat.id !== id)
      );
      
      // Aqui você pode adicionar uma chamada à API para excluir a categoria no backend
      // await api.delete(`/categorias/${id}`);
      
      // Se necessário, você pode mostrar uma notificação de sucesso
      // toast.success("Categoria excluída com sucesso!");
    }
  };

  const getIcone = (categoria: Categoria) => {
    // Se a categoria tiver um ícone específico, usa-o, senão usa o padrão do tipo
    return categoria.icone || iconesPorTipo[categoria.tipo] || "tag";
  };

  // Agrupar categorias por tipo
  const categoriasPorTipo = categorias.reduce((acc, categoria) => {
    if (!acc[categoria.tipo]) {
      acc[categoria.tipo] = [];
    }
    acc[categoria.tipo].push(categoria);
    return acc;
  }, {} as Record<TipoTransacao, Categoria[]>);

  return (
    <PageLayout
      title="Categorias"
      actionButtons={
        <AddCategoryButton />
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => {
                  // Função para formatar o nome do ícone para o formato PascalCase
                  const formatarNomeIcone = (nomeIcone: string) => {
                    return nomeIcone
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join('');
                  };

                  // Tenta obter o componente de ícone
                  let Icone;
                  try {
                    // Tenta obter o ícone específico da categoria
                    if (categoria.icone) {
                      const nomeFormatado = formatarNomeIcone(categoria.icone);
                      Icone = require('lucide-react')[nomeFormatado];
                    }
                    
                    // Se não encontrou o ícone específico, tenta obter o ícone padrão do tipo
                    if (!Icone && iconesPorTipo[categoria.tipo]) {
                      const nomePadrao = formatarNomeIcone(iconesPorTipo[categoria.tipo]);
                      Icone = require('lucide-react')[nomePadrao];
                    }
                    
                    // Se ainda não encontrou, usa o ícone Tag como fallback
                    if (!Icone) {
                      Icone = require('lucide-react').Tag;
                    }
                  } catch (error) {
                    // Em caso de erro, usa o ícone Tag
                    Icone = require('lucide-react').Tag;
                  }
                  
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
                              style={{ backgroundColor: `${categoria.cor}20` }}
                            >
                              <Icone className="w-5 h-5" style={{ color: categoria.cor }} />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{categoria.nome}</h3>
                              <Badge 
                                className={cn(
                                  "mt-1 text-xs capitalize",
                                  coresBadgePorTipo[categoria.tipo]
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
                                onClick={(e) => handleEditarCategoria(categoria.id, e)}
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => handleExcluirCategoria(categoria.id, e)}
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