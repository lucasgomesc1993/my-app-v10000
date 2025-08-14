import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/button";
import { MoreVertical, Pencil, Trash2, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardHeader, CardTitle, CardContent } from "@/components/card";

interface BudgetCardProps {
  id: string;
  nome: string;
  categoria: {
    id: string;
    nome: string;
    cor: string;
    icone?: string;
  };
  valor: number;
  valorUtilizado: number;
  periodo: "diario" | "semanal" | "mensal" | "anual";
  onEdit: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

// Função para formatar o nome do ícone para o formato PascalCase
const formatarNomeIcone = (nomeIcone: string) => {
  return nomeIcone
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

// Função para formatar o período
const formatarPeriodo = (periodo: string) => {
  const periodos: Record<string, string> = {
    diario: "Diário",
    semanal: "Semanal",
    mensal: "Mensal",
    anual: "Anual",
  };
  return periodos[periodo] || periodo;
};

// Formatar valor monetário
const formatarValor = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function BudgetCard({
  id,
  nome,
  categoria,
  valor,
  valorUtilizado,
  periodo,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const porcentagemUtilizada = Math.min(Math.round((valorUtilizado / valor) * 100), 100);
  const estaNoLimite = porcentagemUtilizada >= 100;
  const estaPertoDoLimite = porcentagemUtilizada >= 80 && porcentagemUtilizada < 100;

  // Tenta obter o componente de ícone
  let Icone;
  try {
    // Tenta obter o ícone específico da categoria
    if (categoria.icone) {
      const nomeFormatado = formatarNomeIcone(categoria.icone);
      Icone = require('lucide-react')[nomeFormatado];
    }
    
    // Se não encontrou o ícone específico, usa o ícone padrão
    if (!Icone) {
      Icone = Wallet;
    }
  } catch (error) {
    // Em caso de erro, usa o ícone Wallet
    Icone = Wallet;
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden border border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80",
        "group hover:-translate-y-1"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${categoria.cor}20`,
              color: categoria.cor
            }}
          >
            <Icone className="h-5 w-5" style={{ color: 'inherit' }} />
          </div>
          <div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                {nome}
              </CardTitle>
              <span 
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mt-1.5"
                style={{
                  backgroundColor: `${categoria.cor}20`,
                  color: categoria.cor,
                  border: `1px solid ${categoria.cor}40`
                }}
              >
                {categoria.nome}
              </span>
            </div>
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
              onClick={(e) => onEdit(id, e)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => onDelete(id, e)}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="relative z-10 px-4 pb-4 pt-0 space-y-4">
        {/* Linha de valores */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Utilizado</p>
            <p className="text-sm font-medium">{formatarValor(valorUtilizado)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-sm font-medium">{formatarValor(valor)}</p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div>
          <Progress 
            value={porcentagemUtilizada} 
            className={cn(
              "h-2",
              estaNoLimite 
                ? "bg-destructive/20" 
                : estaPertoDoLimite 
                  ? "bg-amber-500/20" 
                  : "bg-primary/20"
            )}
            indicatorClassName={cn(
              estaNoLimite 
                ? "bg-destructive" 
                : estaPertoDoLimite 
                  ? "bg-amber-500" 
                  : "bg-primary"
            )}
          />
        </div>

        {/* Linha de status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className={cn(
              "font-medium",
              estaNoLimite 
                ? "text-destructive" 
                : estaPertoDoLimite 
                  ? "text-amber-500" 
                  : "text-primary"
            )}>
              {porcentagemUtilizada}% utilizado
            </span>
            <div className="font-medium">
              {formatarValor(Math.max(0, valor - valorUtilizado))} restantes
            </div>
          </div>
          
          <div className="h-px w-full bg-border/50"></div>
          
          <div className="text-xs text-muted-foreground">
            Período: {formatarPeriodo(periodo).toLowerCase()}
          </div>
        </div>
      </CardContent>
    </div>
  );
}
