import { Transacao, FiltrosTransacoes, OrdenacaoTransacoes, Categoria } from "./index";

declare module "@/services/api" {
  interface ApiClient {
    // Transações
    buscarTransacoes(params?: {
      filtros?: FiltrosTransacoes;
      ordenacao?: OrdenacaoTransacoes;
      pagina?: number;
      itensPorPagina?: number;
    }): Promise<{ dados: Transacao[]; total: number; pagina: number; totalPaginas: number }>;
    
    criarTransacao(data: any): Promise<Transacao>;
    atualizarTransacao(id: string, data: any): Promise<Transacao>;
    excluirTransacao(id: string): Promise<void>;
    
    // Contas
    buscarContas(): Promise<any[]>;
    criarConta(data: any): Promise<any>;
    editarConta(id: string, data: any): Promise<any>;
    excluirConta(id: string): Promise<void>;
    
    // Categorias
    buscarCategorias(): Promise<Categoria[]>;
    criarCategoria(data: any): Promise<Categoria>;
    editarCategoria(id: string, data: any): Promise<Categoria>;
    excluirCategoria(id: string): Promise<void>;
    countTransactionsByCategory(categoryId: string): Promise<number>;
    
    // Bancos
    buscarBancos(): Promise<any[]>;
    criarBanco(data: { name: string }): Promise<{ id: number; name: string }>;
    
    // Cartões de Crédito
    buscarCartoes(): Promise<any[]>;
    criarCartao(data: any): Promise<any>;
    editarCartao(id: string, data: any): Promise<any>;
    excluirCartao(id: string): Promise<void>;
    
    // Faturas
    buscarFaturas(creditCardId?: number): Promise<any[]>;
    criarFatura(data: any): Promise<any>;
    pagarFatura(invoiceId: number, paymentData: any): Promise<any>;
  }
  
  const api: ApiClient;
  export default api;
}
