"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import { AddAccountButton } from "@/components/add-account-button";
import { AccountActionsDialog } from "@/components/dialogs/account-actions-dialog";
import { EditAccountDialog } from "@/components/dialogs/edit-account-dialog";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

type ContaBancaria = {
  id: string;
  name: string;
  bankName?: string;
  type: 'corrente' | 'poupanca' | 'investimento' | 'outro';
  balance: number;
  isFavorite?: boolean;
};

const formatarSaldo = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function ContasPage() {
  const [contas, setContas] = useState<ContaBancaria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<ContaBancaria | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const carregarContas = async () => {
    try {
      setIsLoading(true);
      const contasData = await api.buscarContas();
      setContas(contasData);
    } catch (error) {
      console.error('Erro ao carregar contas:', error instanceof Error ? error.message : error);
      // Mostrar toast de erro para o usuário
      // toast.error('Erro ao carregar contas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarContas();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    try {
      const conta = contas.find(c => c.id === id);
      if (!conta) return;

      // Atualizar localmente primeiro para UX responsiva
      setContas(prev => 
        prev.map(conta => 
          conta.id === id 
            ? { ...conta, isFavorite: !conta.isFavorite }
            : conta
        )
      );

      // TODO: Implementar API para atualizar favorito
      // await api.toggleFavoriteConta(id);
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      // Reverter mudança em caso de erro
      setContas(prev => 
        prev.map(conta => 
          conta.id === id 
            ? { ...conta, isFavorite: !conta.isFavorite }
            : conta
        )
      );
    }
  };

  const handleAccountAction = (account: ContaBancaria) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const handleEditAccount = (account: any) => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(true);
    // selectedAccount já está definido
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await api.excluirConta(accountId);
      setIsDialogOpen(false);
      setSelectedAccount(null);
      carregarContas(); // Recarregar lista após exclusão
      // toast.success('Conta excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir conta:', error instanceof Error ? error.message : error);
      // toast.error('Erro ao excluir conta. Tente novamente.');
    }
  };

  const handleAccountDeleted = () => {
    setIsDialogOpen(false);
    setSelectedAccount(null);
    carregarContas(); // Recarregar lista após exclusão
  };

  const handleAccountUpdated = () => {
    setIsDialogOpen(false);
    setSelectedAccount(null);
    carregarContas(); // Recarregar lista após atualização
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTypeLabel = (type: string) => {
    const types = {
      corrente: 'Conta Corrente',
      poupanca: 'Poupança',
      investimento: 'Investimento',
      outro: 'Outro'
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <PageLayout title="Contas Bancárias">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando contas...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Contas Bancárias"
      actionButtons={<AddAccountButton onAccountCreated={carregarContas} />}
    >
      <div className="space-y-4">
        {contas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-muted-foreground mb-2">Nenhuma conta encontrada</div>
            <div className="text-sm text-muted-foreground">Adicione sua primeira conta bancária</div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contas.map((conta) => (
              <Card 
                key={conta.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-200 hover:shadow-md",
                  "group hover:-translate-y-1 cursor-pointer"
                )}
                onClick={() => handleAccountAction(conta)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                    conta.type === 'corrente' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    conta.type === 'poupanca' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    conta.type === 'investimento' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}>
                    {conta.type === 'corrente' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-2">
                        <path d="M17 14h.01" />
                        <path d="M21 12a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
                        <path d="M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
                      </svg>
                    )}
                    {conta.type === 'poupanca' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-piggy-bank">
                        <rect width="18" height="12" x="3" y="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                        <path d="M16 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                      </svg>
                    )}
                    {conta.type === 'investimento' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart">
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                    )}
                    {conta.type === 'outro' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-foreground">
                      {conta.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {conta.bankName || 'Banco não informado'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(conta.id);
                  }}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    conta.isFavorite 
                      ? 'text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30' 
                      : 'text-muted-foreground/40 hover:bg-muted/50 hover:text-muted-foreground'
                  }`}
                  aria-label={conta.isFavorite ? `Remover ${conta.name} dos favoritos` : `Definir ${conta.name} como favorita`}
                  title={conta.isFavorite ? 'Remover dos favoritos' : 'Marcar como favorita'}
                >
                  <Star 
                    className={`h-4 w-4 transition-all duration-200 ${
                      conta.isFavorite ? 'fill-current' : ''
                    }`} 
                  />
                </button>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Saldo disponível</p>
                    <div className="text-xl font-bold tracking-tight text-foreground">
                      {formatCurrency(conta.balance)}
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    conta.type === 'corrente' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    conta.type === 'poupanca' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    conta.type === 'investimento' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {getTypeLabel(conta.type)}
                  </span>
                </div>
              </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {selectedAccount && (
          <AccountActionsDialog
            account={{
              id: selectedAccount.id,
              nome: selectedAccount.name,
              tipo: getTypeLabel(selectedAccount.type),
              saldo: selectedAccount.balance,
              banco: selectedAccount.bankName || 'Banco não informado',
              favorita: selectedAccount.isFavorite || false
            }}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
          />
        )}

        {selectedAccount && (
          <EditAccountDialog
            account={selectedAccount}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onAccountUpdated={() => {
              setIsEditDialogOpen(false);
              setSelectedAccount(null);
              carregarContas();
            }}
          />
        )}
      </div>
    </PageLayout>
  );
}
