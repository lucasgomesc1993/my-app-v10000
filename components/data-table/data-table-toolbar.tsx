import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Search } from "lucide-react"

import { Button } from "@/components/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { cn } from "@/lib/utils"

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  searchKey?: string
  placeholder?: string
  actions?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  placeholder = "Filtrar...",
  actions,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)} {...props}>
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative max-w-sm flex-1">
          {searchKey && (
            <>
              <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
              <Input
                placeholder={placeholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="h-9 pl-8 sm:w-[250px] lg:w-[300px]"
              />
            </>
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <span className="sr-only">Limpar filtros</span>
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {actions}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
