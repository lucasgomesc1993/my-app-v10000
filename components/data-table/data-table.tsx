"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { DataTableProps } from "@/types/table"

const DataTable = <TData, TValue>({
  columns,
  data,
  onSortingChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onRowSelectionChange,
  rowCount,
  pageCount: controlledPageCount,
  pageIndex: controlledPageIndex = 0,
  pageSize: controlledPageSize = 10,
  onPaginationChange,
  loading = false,
  error = null,
  emptyState = null,
  className,
  enableRowSelection = true,
  enableMultiRowSelection = true,
  enableSorting = true,
  enableFilters = true,
  enablePagination = true,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  defaultSorting = [],
  defaultColumnFilters = [],
  defaultColumnVisibility = {},
  getRowId = (row: TData & { id?: string }) => (row as any).id || Math.random().toString(36).substr(2, 9),
  meta,
  state: controlledState,
  searchKey,
  searchPlaceholder,
  toolbarActions,
}: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(defaultColumnVisibility)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(defaultColumnFilters)
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
  const [pagination, setPagination] = React.useState({
    pageIndex: controlledPageIndex,
    pageSize: controlledPageSize,
  })

  const table = useReactTable({
    data,
    columns,
    pageCount: controlledPageCount,
    state: {
      sorting: controlledState?.sorting || sorting,
      columnFilters: controlledState?.columnFilters || columnFilters,
      columnVisibility: controlledState?.columnVisibility || columnVisibility,
      rowSelection: controlledState?.rowSelection || rowSelection,
      pagination: controlledState?.pagination || (enablePagination ? pagination : undefined),
    },
    enableRowSelection,
    enableMultiRowSelection,
    onRowSelectionChange: (updater) => {
      const newRowSelection = typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(newRowSelection)
      onRowSelectionChange?.(newRowSelection)
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      onSortingChange?.(newSorting)
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater
      setColumnFilters(newFilters)
      onColumnFiltersChange?.(newFilters)
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater
      setColumnVisibility(newVisibility)
      onColumnVisibilityChange?.(newVisibility)
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater
      setPagination(newPagination)
      onPaginationChange?.(newPagination)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination,
    manualSorting,
    manualFiltering,
    getRowId,
    meta,
  })

  const defaultEmptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-muted-foreground">
        Nenhum dado encontrado.
      </div>
    </div>
  )

  const emptyContent = emptyState || defaultEmptyState

  return (
    <div className={className}>
      {enableFilters && (
        <DataTableToolbar
          table={table}
          searchKey={searchKey}
          placeholder={searchPlaceholder}
          actions={toolbarActions}
          className="mb-4"
        />
      )}
      
      <div className="border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="ml-2">Carregando...</span>
                    </div>
                  ) : error ? (
                    <div className="text-destructive">
                      Ocorreu um erro ao carregar os dados.
                    </div>
                  ) : (
                    emptyContent
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {enablePagination && (
        <div className="mt-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  )
}

export { DataTable }
