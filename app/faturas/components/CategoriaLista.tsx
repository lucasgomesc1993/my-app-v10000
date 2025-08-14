'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import { IconRenderer } from '@/lib/icon-utils';

// Tipos
export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  data: string;
}

export interface Categoria {
  id: string;
  nome: string;
  cor: string;
  valorTotal: number;
  transacoes: Transacao[];
  icone?: string;
  tipo?: string;
}

interface CategoriaListaProps {
  categorias: Categoria[];
  className?: string;
}

export function CategoriaLista({ categorias, className }: CategoriaListaProps) {
  const [categoriasAbertas, setCategoriasAbertas] = useState<Record<string, boolean>>({});

  // Função para alternar o estado de uma categoria (aberto/fechado)
  const toggleCategoria = useCallback((categoriaId: string) => {
    setCategoriasAbertas(prev => ({
      ...prev,
      [categoriaId]: !prev[categoriaId]
    }));
  }, []);

  // Se não houver categorias, não renderiza nada
  if (!categorias.length) return null;

  return (
    <div className={cn("space-y-0", className)}>
      <div className="space-y-0">
        {categorias.map((categoria) => {
          const estaAberta = categoriasAbertas[categoria.id];
          const temTransacoes = categoria.transacoes.length > 0;
          
          return (
            <div key={categoria.id} className="border-b border-border/50 last:border-b-0">
              <button
                onClick={() => toggleCategoria(categoria.id)}
                className={cn(
                  "w-full flex items-center justify-between py-3 px-3 -mx-1 rounded-md",
                  "hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "focus:ring-offset-2 focus:ring-offset-background"
                )}
                aria-expanded={estaAberta}
                aria-controls={`categoria-${categoria.id}`}
                disabled={!temTransacoes}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div 
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium"
                    style={{ 
                      backgroundColor: `${categoria.cor}33`, 
                      color: categoria.cor,
                    }}
                    aria-hidden="true"
                  >
                    <IconRenderer 
                      iconName={categoria.icone} 
                      className="w-3.5 h-3.5"
                    />
                  </div>
                  <span className="text-sm font-medium truncate">
                    {categoria.nome}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-sm font-medium whitespace-nowrap">
                    {formatCurrency(categoria.valorTotal)}
                  </span>
                  {temTransacoes && (
                    <span className="text-muted-foreground">
                      {estaAberta ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </button>

              {temTransacoes && estaAberta && (
                <div 
                  id={`categoria-${categoria.id}`}
                  className="ml-8 mt-1 mb-1 space-y-0 overflow-hidden animate-in fade-in-50"
                  aria-live="polite"
                >
                  {categoria.transacoes.map((transacao, index) => (
                    <div 
                      key={transacao.id}
                      className={cn(
                        "flex items-center justify-between py-2.5 px-1 -mx-1 rounded",
                        index < categoria.transacoes.length - 1 && "border-b border-border/30"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{transacao.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(transacao.data, 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <span className="text-sm font-medium whitespace-nowrap ml-2">
                        {formatCurrency(transacao.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
