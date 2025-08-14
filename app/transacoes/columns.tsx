import { ColumnDef } from "@tanstack/react-table"
import { Transacao, TipoTransacao } from "@/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/badge"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Função para formatar o valor monetário
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

// Função para obter a variante do badge baseada no tipo de transação
const getVariant = (tipo: TipoTransacao) => {
  switch (tipo) {
    case 'receita':
      return 'default'
    case 'despesa':
      return 'destructive'
    case 'transferencia':
      return 'outline'
    default:
      return 'secondary'
  }
}

export const columns: ColumnDef<Transacao>[] = [
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('descricao')}</div>
    },
  },
  {
    accessorKey: 'categoria',
    header: 'Categoria',
    cell: ({ row }) => {
      const categoria = row.original.categoria
      return (
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: categoria.cor }}
          />
          {categoria.nome}
        </div>
      )
    },
  },
  {
    accessorKey: 'origem',
    header: 'Origem',
    cell: ({ row }) => {
      const origem = row.original.origem;
      return <div>{typeof origem === 'object' ? origem.nome : origem}</div>;
    },
  },
  {
    accessorKey: 'data',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 hover:bg-transparent"
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = new Date(row.getValue('data'))
      return format(data, 'dd/MM/yyyy', { locale: ptBR })
    },
  },
  {
    accessorKey: 'valor',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-transparent"
          >
            Valor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue('valor'))
      const tipo = row.original.tipo
      const formatted = formatarMoeda(valor)
      
      return (
        <div className={`text-right font-medium ${tipo === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {tipo === 'despesa' ? '-' : ''}{formatted}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transacao = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2">
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 gap-2">
              <Trash2 className="h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
