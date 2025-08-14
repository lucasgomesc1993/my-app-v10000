"use client";

import { Categoria } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Categoria>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.original.tipo;
      const variant = tipo === "receita" ? "success" : "destructive";
      const text = tipo === "receita" ? "Receita" : "Despesa";
      return <Badge variant={variant}>{text}</Badge>;
    },
  },
  {
    accessorKey: "cor",
    header: "Cor",
    cell: ({ row }) => {
      const cor = row.original.cor;
      return (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: cor }}
          />
          <span>{cor}</span>
        </div>
      );
    },
  },
];