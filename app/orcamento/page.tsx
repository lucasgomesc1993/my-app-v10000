"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { AddBudgetButton } from "@/components/add-budget-button";
import { BudgetCard } from "@/components/budget-card";
import { Button } from "@/components/button";
import { MoreVertical, Pencil, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";

// Tipos para orçamentos
interface Orcamento {
  id: string;
  nome: string;
  categoria: { id: string; nome: string; cor: string };
  valor: number;
  valorUtilizado: number;
  periodo: "mensal" | "semanal" | "anual";
}

export default function OrcamentoPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarOrcamentos = async () => {
    try {
      setLoading(true);
      // Implementar chamada real à API quando disponível
      // const data = await api.buscarOrcamentos();
      // Por enquanto, usando mock data
      const mockData: Orcamento[] = [
        {
          id: "1",
          nome: "Mercado do Mês",
          categoria: { id: "1", nome: "Alimentação", cor: "#EF4444" },
          valor: 1500,
          valorUtilizado: 875,
          periodo: "mensal",
        },
        {
          id: "2",
          nome: "Transporte Diário",
          categoria: { id: "2", nome: "Transporte", cor: "#F59E0B" },
          valor: 300,
          valorUtilizado: 320,
          periodo: "mensal",
        },
        {
          id: "3",
          nome: "Lazer e Entretenimento",
          categoria: { id: "4", nome: "Lazer", cor: "#8B5CF6" },
          valor: 500,
          valorUtilizado: 480,
          periodo: "mensal",
        },
      ];
      setOrcamentos(mockData);
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
      toast.error("Erro ao carregar orçamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const handleEditarOrcamento = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Editar orçamento:", id);
    // Implementar lógica de edição
  };

  const handleExcluirOrcamento = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
      try {
        // Implementar chamada real à API quando disponível
        // await api.excluirOrcamento(id);
        setOrcamentos(prev => prev.filter(orc => orc.id !== id));
        toast.success("Orçamento excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir orçamento:", error);
        toast.error("Erro ao excluir orçamento");
      }
    }
  };

  const handleOrcamentoCriado = () => {
    // Atualizar a lista de orçamentos após criar um novo
    carregarOrcamentos();
    toast.success("Orçamento criado com sucesso!");
  };

  if (loading) {
    return (
      <PageLayout title="Orçamentos">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando orçamentos...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Orçamentos"
      actionButtons={
        <AddBudgetButton onBudgetCreated={handleOrcamentoCriado} />
      }
    >
      {orcamentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">Nenhum orçamento cadastrado</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Comece criando seu primeiro orçamento para controlar seus gastos.
          </p>
          <AddBudgetButton onBudgetCreated={handleOrcamentoCriado}>
            <Button>
              <Wallet className="mr-2 h-4 w-4" />
              Criar Primeiro Orçamento
            </Button>
          </AddBudgetButton>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orcamentos.map((orcamento) => (
            <BudgetCard
              key={orcamento.id}
              id={orcamento.id}
              nome={orcamento.nome}
              categoria={orcamento.categoria}
              valor={orcamento.valor}
              valorUtilizado={orcamento.valorUtilizado}
              periodo={orcamento.periodo}
              onEdit={handleEditarOrcamento}
              onDelete={handleExcluirOrcamento}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
