import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { RiArrowDownLine, RiArrowUpLine, RiBankCardLine, RiExchangeLine } from "@remixicon/react";

type KPICardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
};

function KPICard({ title, value, icon, trend, className }: KPICardProps) {
  // Extrai a classe de cor do ícone
  const iconElement = icon as React.ReactElement<{ className?: string }>;
  const iconColorClass = iconElement?.props?.className?.match(/text-\[var\(--chart-[0-9]+\)\]|text-[a-z]+-[0-9]+/)?.[0] || '';
  
  return (
    <Card className={cn("flex-1 min-w-[200px]", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-normal text-muted-foreground">
          {title}
        </CardTitle>
        <div>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${iconColorClass}`}>{value}</div>
        {trend && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Badge className={cn(
              trend.isPositive 
                ? "bg-emerald-500/24 text-emerald-500" 
                : "bg-destructive/24 text-destructive"
            )}>
              {trend.isPositive ? '+' : '-'}{trend.value}
            </Badge>
            <span>em relação ao mês passado</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 -m-px">
      <KPICard
        title="Saldo Total"
        value="R$ 25.390,00"
        icon={
          <RiExchangeLine className="h-4 w-4 text-[var(--chart-1)]" />
        }
        trend={{ value: "12.5%", isPositive: true }}
      />
      <KPICard
        title="Receitas"
        value="R$ 18.450,00"
        icon={
          <RiArrowUpLine className="h-4 w-4 text-[var(--chart-6)]" />
        }
        trend={{ value: "8.3%", isPositive: true }}
      />
      <KPICard
        title="Despesas"
        value="R$ 12.340,00"
        icon={
          <RiArrowDownLine className="h-4 w-4 text-[var(--chart-4)]" />
        }
        trend={{ value: "3.2%", isPositive: false }}
      />
      <KPICard
        title="Despesa Cartão"
        value="R$ 6.110,00"
        icon={
          <RiBankCardLine className="h-4 w-4 text-orange-500" />
        }
        trend={{ value: "15.7%", isPositive: false }}
      />
    </div>
  );
}
