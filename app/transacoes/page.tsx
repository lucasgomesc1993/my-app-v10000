"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiDownloadLine, RiUploadLine } from "@remixicon/react"
import { ColumnFiltersState, SortingState, PaginationState } from "@tanstack/react-table"

import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/button"
import { Card, CardContent } from "@/components/card"
import { DataTable } from "@/components/data-table/data-table"
import { ActionButtons } from "@/components/action-buttons"
import { columns } from "./columns"
import { api } from "@/services/api"
import { Transacao, TipoTransacao } from "@/types"

export default function TransacoesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(0)

  const [sorting, setSorting] = useState<SortingState>([{ id: "data", desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const carregarTransacoes = async () => {
    try {
      setIsLoading(true)
      const { pageIndex, pageSize } = pagination
      const sort = sorting[0]
      const filters = columnFilters.reduce((acc, filter) => {
        acc[filter.id] = filter.value
        return acc
      }, {} as Record<string, any>)

      const response = await api.buscarTransacoes({
        pagina: pageIndex + 1,
        itensPorPagina: pageSize,
        ordenacao: {
          campo: sort?.id as 'data' | 'valor' | 'descricao' | 'categoria',
          direcao: sort?.desc ? 'desc' : 'asc',
        },
        filtros: {
          busca: filters.descricao || "",
          tipos: filters.tipo ? [filters.tipo] : undefined,
        },
      })

      setTransacoes(response.dados)
      setTotal(response.total)
      setPageCount(response.totalPaginas)
    } catch (error) {
      console.error("Erro ao carregar transações:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    carregarTransacoes()
  }, [pagination, sorting, columnFilters])

  const setTipoFilter = (tipo?: TipoTransacao) => {
    setColumnFilters(prev => {
      const otherFilters = prev.filter(f => f.id !== 'tipo');
      return tipo ? [...otherFilters, { id: 'tipo', value: tipo }] : otherFilters;
    });
  }

  const tipoFiltro = columnFilters.find(f => f.id === 'tipo')?.value as TipoTransacao | undefined;

  return (
    <PageLayout
      title="Transações"
      actionButtons={<ActionButtons />}
    >
      <div className="grid gap-6">
        <div className="flex flex-wrap gap-2">
          <Button variant={!tipoFiltro ? 'secondary' : 'ghost'} onClick={() => setTipoFilter()}>
            Todos
          </Button>
          <Button variant={tipoFiltro === 'receita' ? 'secondary' : 'ghost'} onClick={() => setTipoFilter('receita')}>
            Receitas
          </Button>
          <Button variant={tipoFiltro === 'despesa' ? 'secondary' : 'ghost'} onClick={() => setTipoFilter('despesa')}>
            Despesas
          </Button>
          <Button variant={tipoFiltro === 'transferencia' ? 'secondary' : 'ghost'} onClick={() => setTipoFilter('transferencia')}>
            Transferências
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={transacoes}
              loading={isLoading}
              onSortingChange={setSorting}
              onColumnFiltersChange={setColumnFilters}
              onPaginationChange={setPagination}
              pageCount={pageCount}
              rowCount={total}
              state={{
                sorting,
                columnFilters,
                pagination,
              }}
              manualPagination
              manualSorting
              manualFiltering
              searchKey="descricao"
              searchPlaceholder="Filtrar por descrição..."
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}