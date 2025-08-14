import { Transacao, FiltrosTransacoes, OrdenacaoTransacoes } from "@/types"

type BuscarTransacoesParams = {
  filtros?: FiltrosTransacoes
  ordenacao?: OrdenacaoTransacoes
  pagina?: number
  itensPorPagina?: number
}

type BuscarTransacoesResponse = {
  dados: Transacao[]
  total: number
  pagina: number
  totalPaginas: number
}

type CriarTransacaoData = {
  tipo: 'receita' | 'despesa' | 'transferencia'
  descricao: string
  valor: number
  data: string
  categoriaId: string
  contaOrigemId: string
  contaDestinoId?: string
  observacoes?: string
}

export type CriarContaData = {
  nome: string
  tipo: 'corrente' | 'poupanca' | 'investimento'
  bancoId: string
  agencia?: string
  conta?: string
  saldoInicial?: number
}

type CriarCategoriaData = {
  nome: string
  tipo: 'receita' | 'despesa'
  cor: string
  icone: string
  descricao?: string
}

export const api = {
  async atualizarTransacao(id: string, data: any): Promise<Transacao> {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar transação');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  },
  // Transações
  async buscarTransacoes({
    filtros = {},
    ordenacao = { campo: 'data', direcao: 'desc' },
    pagina = 1,
    itensPorPagina = 10,
  }: BuscarTransacoesParams = {}): Promise<BuscarTransacoesResponse> {
    try {
      const response = await fetch('/api/transactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar transações')
      }

      const data = await response.json()
      
      // Aplicar filtros localmente (pode ser movido para o backend futuramente)
      let dadosFiltrados = [...data.transactions]
      
      if (filtros.tipos?.length) {
        dadosFiltrados = dadosFiltrados.filter(t => filtros.tipos?.includes(t.tipo))
      }
      
      if (filtros.busca) {
        const busca = filtros.busca.toLowerCase()
        dadosFiltrados = dadosFiltrados.filter(t => 
          t.descricao.toLowerCase().includes(busca)
        )
      }
      
      // Aplicar ordenação
      dadosFiltrados.sort((a, b) => {
        let valorA, valorB
        
        switch (ordenacao.campo) {
          case 'data':
            valorA = new Date(a.data).getTime()
            valorB = new Date(b.data).getTime()
            break
          case 'valor':
            valorA = a.valor
            valorB = b.valor
            break
          case 'descricao':
            valorA = a.descricao.toLowerCase()
            valorB = b.descricao.toLowerCase()
            break
          default:
            return 0
        }
        
        if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1
        if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1
        return 0
      })
      
      // Aplicar paginação
      const total = dadosFiltrados.length
      const inicio = (pagina - 1) * itensPorPagina
      const fim = inicio + itensPorPagina
      const dadosPaginados = dadosFiltrados.slice(inicio, fim)
      const totalPaginas = Math.ceil(total / itensPorPagina)
      
      return {
        dados: dadosPaginados,
        total,
        pagina,
        totalPaginas,
      }
    } catch (error) {
      console.error('Erro ao buscar transações:', error)
      throw error
    }
  },

  async criarTransacao(data: CriarTransacaoData): Promise<Transacao> {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar transação')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      throw error
    }
  },

  async excluirTransacao(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir transação')
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
      throw error
    }
  },

  // Contas
  async buscarContas(): Promise<any[]> {
    try {
      const response = await fetch('/api/accounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar contas')
      }

      const data = await response.json()
      return data.accounts || []
    } catch (error) {
      console.error('Erro ao buscar contas:', error)
      throw error
    }
  },

  async criarConta(data: CriarContaData): Promise<any> {
    try {
      console.log('Dados enviados para criar conta:', data);
      
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta da API:', errorData);
        throw new Error(`Erro ao criar conta: ${response.status} - ${errorData}`)
      }

      const result = await response.json();
      console.log('Conta criada com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao criar conta:', error)
      throw error
    }
  },

  async editarConta(id: string, data: CriarContaData): Promise<any> {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao editar conta')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao editar conta:', error)
      throw error
    }
  },

  async excluirConta(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Erro HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Conta excluída com sucesso:', result);
    } catch (error) {
      console.error('Erro ao excluir conta:', error instanceof Error ? error.message : error);
      throw error;
    }
  },

  // Categorias
  async buscarCategorias(): Promise<any[]> {
    try {
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar categorias')
      }

      const data = await response.json()
      return data.categories || []
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      throw error
    }
  },

  async criarCategoria(data: CriarCategoriaData): Promise<any> {
    try {
      console.log('Enviando dados para criar categoria:', data);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMessage = responseData.error || 'Erro ao criar categoria';
        console.error('Erro na resposta da API:', errorMessage, responseData);
        throw new Error(errorMessage);
      }

      console.log('Categoria criada com sucesso:', responseData);
      return responseData;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  async editarCategoria(id: string, data: CriarCategoriaData): Promise<any> {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao editar categoria')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao editar categoria:', error)
      throw error
    }
  },

  async excluirCategoria(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir categoria')
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      throw error
    }
  },

  // Buscar bancos
  async buscarBancos(): Promise<any[]> {
    try {
      const response = await fetch('/api/banks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar bancos')
      }

      const data = await response.json()
      return data.banks || []
    } catch (error) {
      console.error('Erro ao buscar bancos:', error)
      throw error
    }
  },

  // Criar banco
  async criarBanco(data: { name: string }): Promise<{ id: number; name: string }> {
    try {
      const response = await fetch('/api/banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          code: '999', // Código genérico para bancos personalizados
          fullName: data.name,
          isActive: true
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar banco');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao criar banco:', error);
      throw error;
    }
  },

  // Cartões de Crédito
  async buscarCartoes(): Promise<any[]> {
    try {
      const response = await fetch('/api/credit-cards', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar cartões')
      }

      const data = await response.json()
      return data.cards || []
    } catch (error) {
      console.error('Erro ao buscar cartões:', error)
      throw error
    }
  },

  async criarCartao(data: any): Promise<any> {
    try {
      console.log('Dados enviados para criar cartão:', data);
      
      const response = await fetch('/api/credit-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('Response status (cartão):', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta da API (cartão):', errorData);
        throw new Error(`Erro ao criar cartão: ${response.status} - ${errorData}`)
      }

      const result = await response.json();
      console.log('Cartão criado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao criar cartão:', error)
      throw error
    }
  },

  async editarCartao(id: string, data: any): Promise<any> {
    try {
      const response = await fetch(`/api/credit-cards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao editar cartão')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao editar cartão:', error)
      throw error
    }
  },

  async excluirCartao(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/credit-cards/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir cartão')
      }
    } catch (error) {
      console.error('Erro ao excluir cartão:', error)
      throw error
    }
  },

  // Faturas
  async buscarFaturas(creditCardId?: number): Promise<any[]> {
    try {
      const url = creditCardId 
        ? `/api/invoices?creditCardId=${creditCardId}`
        : '/api/invoices'
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar faturas')
      }

      const data = await response.json()
      return data.invoices || []
    } catch (error) {
      console.error('Erro ao buscar faturas:', error)
      throw error
    }
  },

  async criarFatura(data: any): Promise<any> {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar fatura')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar fatura:', error)
      throw error
    }
  },

  async pagarFatura(invoiceId: number, paymentData: any): Promise<any> {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error('Erro ao pagar fatura')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao pagar fatura:', error)
      throw error
    }
  },
}
