import { Cartao } from '@/types/fatura';

// Mock data para cartões
const cartoesMock: Cartao[] = [
  {
    id: '1',
    nome: 'Cartão Nubank',
    bandeira: 'mastercard',
    tipo: 'credito',
    cor: '#8A05BE',
    limite: 5000,
    diaFechamento: 5,
    diaVencimento: 15,
    faturaAtual: 1250.75,
    favorito: true,
    ultimosDigitos: '4321'
  },
  {
    id: '2',
    nome: 'Cartão Inter',
    bandeira: 'visa',
    tipo: 'credito',
    cor: '#FF7A00',
    limite: 3000,
    diaFechamento: 10,
    diaVencimento: 20,
    faturaAtual: 850.30,
    favorito: false,
    ultimosDigitos: '8765'
  },
];

/**
 * Busca todos os cartões do usuário
 */
export async function buscarCartoes(): Promise<Cartao[]> {
  // Simula uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cartoesMock);
    }, 500);
  });
}

/**
 * Busca um cartão específico pelo ID
 */
export async function buscarCartaoPorId(id: string): Promise<Cartao | undefined> {
  const cartoes = await buscarCartoes();
  return cartoes.find(cartao => cartao.id === id);
}

/**
 * Atualiza um cartão existente
 */
export async function atualizarCartao(id: string, dados: Partial<Cartao>): Promise<Cartao> {
  // Em uma implementação real, faria uma requisição para a API
  return new Promise((resolve) => {
    setTimeout(() => {
      const cartaoAtualizado = { ...cartoesMock.find(c => c.id === id)!, ...dados };
      const index = cartoesMock.findIndex(c => c.id === id);
      if (index !== -1) {
        cartoesMock[index] = cartaoAtualizado;
      }
      resolve(cartaoAtualizado);
    }, 500);
  });
}
