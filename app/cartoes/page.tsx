"use client";

import { useState, useEffect } from "react";
import { CreditCard, Star, ArrowUp, ArrowDown, CreditCard as CreditCardIcon, Plus } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CreateCreditCardDialog } from "@/components/dialogs/create-credit-card-dialog";
import { api } from "@/services/api";

// Componente KPI Card simplificado
type KPICardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass?: string;
  className?: string;
};

function KPICard({ title, value, icon, colorClass = "text-foreground", className }: KPICardProps) {
  return (
    <Card className={cn("flex-1 min-w-[200px]", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-normal text-muted-foreground">
          {title}
        </CardTitle>
        <div>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${colorClass}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

type Cartao = {
  id: number;
  name: string;
  brand: 'visa' | 'mastercard' | 'elo' | 'hipercard' | 'american_express' | 'outro';
  type: 'credito' | 'debito' | 'credito_debito';
  lastFourDigits: string;
  color: string;
  creditLimit: number;
  currentBalance: number;
  availableLimit: number;
  closingDay: number; // dia do fechamento da fatura
  dueDay: number; // dia do vencimento da fatura
  isFavorite: boolean;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function CartoesPage() {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarCartoes();
  }, []);

  const carregarCartoes = async () => {
    try {
      setLoading(true);
      const data = await api.buscarCartoes();
      setCartoes(data);
    } catch (err) {
      console.error('Erro ao carregar cartões:', err);
      setError('Erro ao carregar cartões');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorito = async (id: number) => {
    try {
      const cartao = cartoes.find(c => c.id === id);
      if (!cartao) return;
      
      await api.editarCartao(id.toString(), { isFavorite: !cartao.isFavorite });
      await carregarCartoes(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao alterar favorito:', err);
    }
  };

  const handleCardCreated = async (novoCartao: any) => {
    try {
      await api.criarCartao(novoCartao);
      await carregarCartoes(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao criar cartão:', err);
    }
  };



  // Ordena os cartões para que o favorito fique no topo
  const cartoesOrdenados = [...cartoes].sort((a, b) => 
    (a.isFavorite === b.isFavorite) ? 0 : a.isFavorite ? -1 : 1
  );

  // Calcula o total de limite disponível
  const totalLimite = cartoes.reduce((acc, cartao) => acc + cartao.creditLimit, 0);
  const totalUtilizado = cartoes.reduce((acc, cartao) => acc + cartao.currentBalance, 0);
  const totalDisponivel = totalLimite - totalUtilizado;

  if (loading) {
    return (
      <PageLayout title="Cartões">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando cartões...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Cartões">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={carregarCartoes}>Tentar novamente</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Cartões"
      actionButtons={
        <CreateCreditCardDialog onCardCreated={handleCardCreated}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Cartão
          </Button>
        </CreateCreditCardDialog>
      }
    >
      {/* KPIs dos Cartões */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 -m-px mb-6">
        <KPICard
          title="Limite Total"
          value={formatarMoeda(totalLimite)}
          colorClass="text-[var(--chart-1)]"
          icon={
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="h-4 w-4 text-[var(--chart-1)]"
            >
              <path d="M12.0049 22.0027C6.48204 22.0027 2.00488 17.5256 2.00488 12.0027C2.00488 6.4799 6.48204 2.00275 12.0049 2.00275C17.5277 2.00275 22.0049 6.4799 22.0049 12.0027C22.0049 17.5256 17.5277 22.0027 12.0049 22.0027ZM12.0049 20.0027C16.4232 20.0027 20.0049 16.421 20.0049 12.0027C20.0049 7.58447 16.4232 4.00275 12.0049 4.00275C7.5866 4.00275 4.00488 7.58447 4.00488 12.0027C4.00488 16.421 7.5866 20.0027 12.0049 20.0027ZM7.00488 13.0027H16.0049V15.0027H12.0049V18.0027L7.00488 13.0027ZM12.0049 9.00275V6.00275L17.0049 11.0027H8.00488V9.00275H12.0049Z" />
            </svg>
          }
        />
        
        <KPICard
          title="Utilizado"
          value={formatarMoeda(totalUtilizado)}
          colorClass="text-[var(--chart-4)]"
          icon={
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-[var(--chart-4)]"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          }
        />
        
        <KPICard
          title="Disponível"
          value={formatarMoeda(totalDisponivel)}
          colorClass="text-[var(--chart-6)]"
          icon={
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-[var(--chart-6)]"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          }
        />
        
        <KPICard
          title="Fatura Atual"
          value={formatarMoeda(cartoes.reduce((acc, cartao) => acc + cartao.faturaAtual, 0))}
          colorClass="text-orange-500"
          icon={
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="h-4 w-4 text-orange-500"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
              <path d="M7 12h10v2H7z" />
            </svg>
          }
        />
      </div>

      {/* Lista de Cartões */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cartoesOrdenados.map((cartao) => (
          <div 
            key={cartao.id}
            className={cn(
              "relative overflow-hidden border border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80",
              "group hover:-translate-y-1"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                       style={{ backgroundColor: cartao.color }}>
                    {cartao.brand === 'visa' ? 'V' : 
                     cartao.brand === 'mastercard' ? 'M' : 
                     cartao.brand === 'elo' ? 'E' : 
                     cartao.brand === 'hipercard' ? 'H' : 
                     cartao.brand === 'american_express' ? 'A' : 'C'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{cartao.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {cartao.brand} • **** {cartao.lastFourDigits}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(cartao.id);
                  }}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    cartao.isFavorite 
                      ? 'text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30' 
                      : 'text-muted-foreground/40 hover:bg-muted/50 hover:text-muted-foreground'
                  }`}
                  aria-label={cartao.isFavorite ? `Remover ${cartao.name} dos favoritos` : `Definir ${cartao.name} como favorito`}
                  title={cartao.isFavorite ? 'Remover dos favoritos' : 'Marcar como favorito'}
                >
                  <Star 
                    className={`h-4 w-4 transition-colors duration-200 ${
                      cartao.isFavorite ? 'fill-current' : ''
                    }`} 
                  />
                </button>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10 px-4 pb-4 pt-0 space-y-4">
              {/* Linha de valores */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Saldo atual</p>
                  <p className="text-sm font-medium">{formatarMoeda(cartao.currentBalance)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Limite total</p>
                  <p className="text-sm font-medium">{formatarMoeda(cartao.creditLimit)}</p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Utilizado</span>
                  <span className={cn(
                    "font-medium",
                    cartao.currentBalance / cartao.creditLimit > 0.8 
                      ? "text-destructive" 
                      : cartao.currentBalance / cartao.creditLimit > 0.5 
                        ? "text-amber-500" 
                        : "text-primary"
                  )}>
                    {Math.round((cartao.currentBalance / cartao.creditLimit) * 100)}% do limite
                  </span>
                </div>
                <Progress 
                  value={(cartao.currentBalance / cartao.creditLimit) * 100} 
                  className={cn(
                    "h-2",
                    cartao.currentBalance / cartao.creditLimit > 0.8 
                      ? "bg-destructive/20" 
                      : cartao.currentBalance / cartao.creditLimit > 0.5 
                        ? "bg-amber-500/20" 
                        : "bg-primary/20"
                  )}
                  indicatorClassName={cn(
                    cartao.currentBalance / cartao.creditLimit > 0.8 
                      ? "bg-destructive" 
                      : cartao.currentBalance / cartao.creditLimit > 0.5 
                        ? "bg-amber-500" 
                        : "bg-primary"
                  )}
                />
              </div>

              {/* Linha de status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">
                    {formatarMoeda(cartao.availableLimit)} disponíveis
                  </span>
                  <div className="text-muted-foreground">
                    {cartao.type === 'credito' ? 'Crédito' : cartao.type === 'debito' ? 'Débito' : 'Crédito/Débito'}
                  </div>
                </div>
                
                <div className="h-px w-full bg-border/50"></div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fechamento: dia {cartao.closingDay}</span>
                  <span>Vencimento: dia {cartao.dueDay}</span>
                </div>
              </div>
            </CardContent>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
