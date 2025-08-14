import { Fatura, ItemFatura } from '@/types/fatura';

// Mock data para itens de fatura
const itensMock: ItemFatura[] = [
  {
    id: '1',
    descricao: 'Compra no Supermercado',
    valor: 150.75,
    data: '2025-01-15',
    categoria: 'Alimentação'
  },
  {
    id: '2',
    descricao: 'Posto de Gasolina',
    valor: 200.00,
    data: '2025-01-18',
    categoria: 'Transporte'
  },
  {
    id: '3',
    descricao: 'Restaurante',
    valor: 85.50,
    data: '2025-01-20',
    categoria: 'Alimentação'
  },
  {
    id: '4',
    descricao: 'Farmácia',
    valor: 45.25,
    data: '2025-01-22',
    categoria: 'Saúde'
  }
];

// Mock data para faturas
const faturasMock: Fatura[] = [
  // Fatura atual (agosto/2025)
  {
    id: 'fatura-atual-1',
    cartaoId: '1',
    mes: 8, // Agosto
    ano: 2025, // Ano atual
    dataVencimento: '2025-09-15',
    dataFechamento: '2025-09-05',
    valorTotal: 1875.50,
    valorPago: 0,
    status: 'aberta',
    itens: [
      {
        id: 'item-1',
        descricao: 'Supermercado Extra',
        valor: 450.75,
        data: '2025-08-10',
        categoria: 'Alimentação'
      },
      {
        id: 'item-2',
        descricao: 'Posto Ipiranga',
        valor: 280.00,
        data: '2025-08-12',
        categoria: 'Transporte'
      },
      {
        id: 'item-3',
        descricao: 'Restaurante Sabor da Terra',
        valor: 145.90,
        data: '2025-08-05',
        categoria: 'Alimentação'
      },
      {
        id: 'item-4',
        descricao: 'Cinema',
        valor: 70.00,
        data: '2025-08-08',
        categoria: 'Lazer'
      },
      {
        id: 'item-5',
        descricao: 'Farmácia Droga Raia',
        valor: 89.85,
        data: '2025-08-15',
        categoria: 'Saúde'
      }
    ]
  },
  
  // Fatura futura (setembro/2025)
  {
    id: 'fatura-futura-1',
    cartaoId: '1',
    mes: 9, // Setembro
    ano: 2025, // Ano atual
    dataVencimento: '2025-10-15',
    dataFechamento: '2025-10-05',
    valorTotal: 950.25,
    valorPago: 0,
    status: 'aberta',
    itens: [
      {
        id: 'item-6',
        descricao: 'Assinatura Netflix',
        valor: 39.90,
        data: '2025-09-02',
        categoria: 'Lazer'
      },
      {
        id: 'item-7',
        descricao: 'Uber',
        valor: 75.50,
        data: '2025-09-10',
        categoria: 'Transporte'
      },
      {
        id: 'item-8',
        descricao: 'Mercado Extra',
        valor: 320.75,
        data: '2025-09-15',
        categoria: 'Alimentação'
      },
      {
        id: 'item-9',
        descricao: 'Academia',
        valor: 120.00,
        data: '2025-09-05',
        categoria: 'Saúde'
      },
      {
        id: 'item-10',
        descricao: 'Restaurante',
        valor: 95.60,
        data: '2025-09-20',
        categoria: 'Alimentação'
      },
      {
        id: 'item-11',
        descricao: 'Posto Ipiranga',
        valor: 280.00,
        data: '2025-09-18',
        categoria: 'Transporte'
      }
    ]
  },
  
  // Faturas passadas (janeiro a julho/2025)
  {
    id: 'fatura-1',
    cartaoId: '1',
    mes: 1,
    ano: 2025,
    dataVencimento: '2025-02-10',
    dataFechamento: '2025-01-31',
    valorTotal: 1250.75,
    valorPago: 1250.75,
    status: 'paga',
    itens: itensMock
  },
  {
    id: 'fatura-2',
    cartaoId: '1',
    mes: 2,
    ano: 2025,
    dataVencimento: '2025-03-10',
    dataFechamento: '2025-02-28',
    valorTotal: 980.50,
    valorPago: 980.50,
    status: 'paga',
    itens: itensMock
  },
  {
    id: 'fatura-3',
    cartaoId: '1',
    mes: 3,
    ano: 2025,
    dataVencimento: '2025-04-10',
    dataFechamento: '2025-03-31',
    valorTotal: 1560.25,
    valorPago: 1560.25,
    status: 'paga',
    itens: itensMock
  },
  {
    id: 'fatura-4',
    cartaoId: '1',
    mes: 4,
    ano: 2025,
    dataVencimento: '2025-05-10',
    dataFechamento: '2025-04-30',
    valorTotal: 875.90,
    valorPago: 875.90,
    status: 'paga',
    itens: itensMock
  },
  {
    id: 'fatura-5',
    cartaoId: '1',
    mes: 5,
    ano: 2025,
    dataVencimento: '2025-06-10',
    dataFechamento: '2025-05-31',
    valorTotal: 2100.75,
    valorPago: 2100.75,
    status: 'paga',
    itens: itensMock
  },
  {
    id: 'fatura-6',
    cartaoId: '1',
    mes: 6,
    ano: 2025,
    dataVencimento: '2025-07-10',
    dataFechamento: '2025-06-30',
    valorTotal: 1430.50,
    valorPago: 1430.50,
    status: 'paga',
    itens: itensMock
  },
  {
    id: 'fatura-7',
    cartaoId: '1',
    mes: 7,
    ano: 2025,
    dataVencimento: '2025-08-10',
    dataFechamento: '2025-07-31',
    valorTotal: 1780.25,
    valorPago: 1780.25,
    status: 'paga',
    itens: itensMock
  }
];

/**
 * Busca todas as faturas de um cartão específico
 */
export async function buscarFaturas(cartaoId: string): Promise<Fatura[]> {
  // Simula uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      const faturas = faturasMock.filter(fatura => fatura.cartaoId === cartaoId);
      resolve(faturas);
    }, 500);
  });
}

/**
 * Processa o pagamento de uma fatura
 */
export async function processarPagamentoFatura(
  faturaId: string, 
  contaId: string, 
  valor: number
): Promise<void> {
  // Simula uma chamada de API para processar o pagamento
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const faturaIndex = faturasMock.findIndex(fatura => fatura.id === faturaId);
      
      if (faturaIndex === -1) {
        reject(new Error('Fatura não encontrada'));
        return;
      }

      const fatura = faturasMock[faturaIndex];
      
      // Valida se o valor é válido
      if (valor <= 0 || valor > fatura.valorTotal) {
        reject(new Error('Valor de pagamento inválido'));
        return;
      }

      // Atualiza a fatura com o pagamento
      fatura.valorPago = (fatura.valorPago || 0) + valor;
      
      // Se o valor pago for igual ou maior que o total, marca como paga
      if (fatura.valorPago >= fatura.valorTotal) {
        fatura.status = 'paga';
        fatura.valorPago = fatura.valorTotal; // Garante que não pague mais que o devido
      }

      resolve();
    }, 1000); // Simula um tempo de processamento maior
  });
}

/**
 * Busca uma fatura específica pelo ID
 */
export async function buscarFaturaPorId(faturaId: string): Promise<Fatura | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fatura = faturasMock.find(fatura => fatura.id === faturaId);
      resolve(fatura);
    }, 300);
  });
}