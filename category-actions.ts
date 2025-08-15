"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/services/api";

type Category = {
  id: string;
  name: string;
  type: 'receita' | 'despesa' | 'transferencia';
  color: string;
  icon: string;
  description?: string;
  parentId?: string;
};

type CreateCategoryData = {
  nome: string;
  tipo: 'receita' | 'despesa';
  cor: string;
  icone: string;
  descricao?: string;
  parentId?: string;
};

// Função auxiliar para converter entre os formatos de categoria
function toCriarCategoriaData(data: CreateCategoryData) {
  return {
    nome: data.nome,
    tipo: data.tipo,
    cor: data.cor,
    icone: data.icone,
    descricao: data.descricao,
  };
}

export async function createOrUpdateCategory(
  idOrData: string | CreateCategoryData,
  data?: CreateCategoryData
): Promise<Category> {
  try {
    if (typeof idOrData === 'string' && data) {
      // Atualizar categoria existente
      const categoriaData = toCriarCategoriaData(data);
      const response = await api.editarCategoria(idOrData, categoriaData);
      revalidatePath("/categorias");
      return response;
    } else if (typeof idOrData === 'object') {
      // Criar nova categoria
      const categoriaData = toCriarCategoriaData(idOrData);
      const response = await api.criarCategoria(categoriaData);
      revalidatePath("/categorias");
      return response;
    }
    throw new Error("Parâmetros inválidos para createOrUpdateCategory");
  } catch (error) {
    console.error("Erro em createOrUpdateCategory:", error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean }> {
  try {
    await api.excluirCategoria(id);
    revalidatePath("/categorias");
    return { success: true };
  } catch (error) {
    console.error("Erro em deleteCategory:", error);
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await api.buscarCategorias();
  } catch (error) {
    console.error("Erro em getCategories:", error);
    throw error;
  }
}

export async function getCategory(id: string): Promise<Category | undefined> {
  try {
    const categories = await api.buscarCategorias();
    return categories.find((cat: Category) => cat.id === id);
  } catch (error) {
    console.error("Erro em getCategory:", error);
    throw error;
  }
}