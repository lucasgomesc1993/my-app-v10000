import { type ColumnDef, type ColumnFiltersState, type SortingState, type VisibilityState } from "@tanstack/react-table"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onSortingChange?: (sorting: SortingState) => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  onRowSelectionChange?: (selected: Record<string, boolean>) => void
  rowCount?: number
  pageCount?: number
  pageIndex?: number
  pageSize?: number
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  loading?: boolean
  error?: string | null
  emptyState?: React.ReactNode
  className?: string
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  enableSorting?: boolean
  enableFilters?: boolean
  enableColumnResizing?: boolean
  enablePagination?: boolean
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  defaultSorting?: SortingState
  defaultColumnFilters?: ColumnFiltersState
  defaultColumnVisibility?: VisibilityState
  getRowId?: (row: TData) => string
  meta?: Record<string, unknown>
  state?: {
    sorting?: SortingState
    columnFilters?: ColumnFiltersState
    columnVisibility?: VisibilityState
    rowSelection?: Record<string, boolean>
    pagination?: { pageIndex: number; pageSize: number }
  }
  searchKey?: string
  searchPlaceholder?: string
  toolbarActions?: React.ReactNode
}

export interface DataTableColumnDef<TData, TValue = unknown> extends ColumnDef<TData, TValue> {
  header: string | ((props: any) => React.ReactNode)
  cell?: (props: any) => React.ReactNode
  filterComponent?: (props: any) => React.ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
  enableHiding?: boolean
  meta?: Record<string, unknown>
}

export interface DataTableToolbarProps<TData> {
  table: any // Você pode tipar isso melhor com o tipo correto do useReactTable
  filterableColumns?: {
    id: string
    title: string
    options: { label: string; value: string }[]
  }[]
  searchPlaceholder?: string
  searchColumn?: string
  viewOptions?: boolean
  className?: string
}
