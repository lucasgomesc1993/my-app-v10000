import { ReactNode } from "react";
import { Card, CardContent } from "@/components/card";

interface ListaVaziaProps {
  icone: ReactNode;
  titulo: string;
  mensagem: string;
}

export function ListaVazia({ icone, titulo, mensagem }: ListaVaziaProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-3 rounded-full bg-muted mb-4">
          {icone}
        </div>
        <h3 className="text-lg font-medium">{titulo}</h3>
        <p className="text-sm text-muted-foreground mt-1">{mensagem}</p>
      </CardContent>
    </Card>
  );
}
