import * as React from "react"
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table"

export function useDataTable<TData>(
  columns: ColumnDef<TData>[],
  data: TData[],
  options: {
    pageSize?: number
    pageIndex?: number
    totalCount?: number
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
    onSortingChange?: (sorting: { id: string; desc: boolean }[]) => void
    onColumnFiltersChange?: (filters: { id: string; value: unknown }[]) => void
  } = {}
) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }[]>([])
  const [columnFilters, setColumnFilters] = React.useState<{ id: string; value: unknown }[]>([])
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: options.pageIndex || 0,
    pageSize: options.pageSize || 10,
  })

  const table = React.useMemo(
    () => ({
      getHeaderGroups: () => {
        return [
          {
            headers: columns.map((column) => ({
              id: column.id as string,
              column: column,
              getContext: () => ({}),
            })),
          },
        ]
      },
      getRowModel: () => ({
        rows: data.map((row, index) => ({
          id: `row-${index}`,
          original: row,
          getVisibleCells: () =>
            columns.map((column) => ({
              id: `${column.id}-cell-${index}`,
              column: column,
              getContext: () => ({
                getValue: () => (row as any)[column.id as string],
              }),
            })),
        })),
      }),
      getSelectedRowModel: () => ({
        flatRows: Object.keys(rowSelection)
          .filter((key) => rowSelection[key])
          .map((key) => ({
            id: key,
            original: data[parseInt(key, 10)],
          })),
      }),
      getState: () => ({
        rowSelection,
        sorting,
        columnFilters,
        columnVisibility,
        pagination,
      }),
      setRowSelection,
      setSorting: (updater: any) => {
        const newSorting = typeof updater === 'function' ? updater(sorting) : updater
        setSorting(newSorting)
        options.onSortingChange?.(newSorting)
      },
      setColumnFilters: (updater: any) => {
        const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater
        setColumnFilters(newFilters)
        options.onColumnFiltersChange?.(newFilters)
      },
      setColumnVisibility,
      setPagination: (updater: any) => {
        const newPagination = typeof updater === 'function' ? updater(pagination) : updater
        setPagination(newPagination)
        options.onPaginationChange?.(newPagination)
      },
      resetRowSelection: () => setRowSelection({}),
      getPageCount: () =>
        options.totalCount ? Math.ceil(options.totalCount / pagination.pageSize) : 0,
      getFilteredSelectedRowModel: () => ({
        flatRows: Object.keys(rowSelection)
          .filter((key) => rowSelection[key])
          .map((key) => ({
            id: key,
            original: data[parseInt(key, 10)],
          })),
      }),
    }),
    [
      columns,
      data,
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      options,
    ]
  ) as unknown as TableType<TData>

  return {
    table,
    rowSelection,
    setRowSelection,
    sorting,
    setSorting: table.setSorting,
    columnFilters,
    setColumnFilters: table.setColumnFilters,
    columnVisibility,
    setColumnVisibility: table.setColumnVisibility,
    pagination,
    setPagination: table.setPagination,
  }
}
