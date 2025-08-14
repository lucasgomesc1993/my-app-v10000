'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, addMonths, subMonths, isSameMonth, isBefore, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

// Types
import { Cartao, Fatura } from '@/types/fatura';

// Services
import { api } from '@/services/api';

// Components
import { FaturaCard } from './components/FaturaCard';
import { ListaVazia } from './components/ListaVazia';
import { ModalPagamento } from './components/ModalPagamento';
import { ModalDetalhesFatura } from './components/ModalDetalhesFatura';

// Icons
import { ChevronLeft, ChevronRight, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';

// UI Components
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface FaturasPageProps {}

export default function FaturasPage({}: FaturasPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Estados
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [cartoes, setCartoes] = useState<any[]>([]);
  const [faturas, setFaturas] = useState<any[]>([]);
  const [contas, setContas] = useState<any[]>([]);
  const [dataAtual, setDataAtual] = useState(new Date());
  const [cartaoSelecionadoId, setCartaoSelecionadoId] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [faturaSelecionada, setFaturaSelecionada] = useState<any | null>(null);
  const [processando, setProcessando] = useState(false);

  // Buscar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        console.log('=== CARREGANDO DADOS ===');
        
        setCarregando(true);
        
        // Buscar cartões, faturas e contas em paralelo
        const [cartoesData, contasData] = await Promise.all([
          api.buscarCartoes(),
          api.buscarContas()
        ]);
        
        console.log('Cartões carregados:', cartoesData.length);
        console.log('Contas carregadas:', contasData.length);
        
        setCartoes(cartoesData);
        setContas(contasData);
        
        // Define o cartão selecionado
        const cartaoIdParam = searchParams.get('cartaoId');
        const cartaoId = cartaoIdParam ? parseInt(cartaoIdParam) : cartoesData[0]?.id || null;
        console.log('Cartão selecionado ID:', cartaoId);
        setCartaoSelecionadoId(cartaoId);
        
        // Busca as faturas do cartão selecionado
        if (cartaoId) {
          console.log('Buscando faturas para o cartão ID:', cartaoId);
          const faturasData = await api.buscarFaturas(cartaoId);
          console.log('Faturas recebidas:', faturasData.length);
          setFaturas(faturasData);
        }
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar as informações');
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [searchParams]);

  // Filtrar faturas
  const { atual, proximas, passadas } = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth(); // Usando o mês atual do sistema (0-11)
    const anoAtual = hoje.getFullYear(); // Usando o ano atual do sistema
    
    console.log('\n=== FILTRANDO FATURAS ===');
    console.log('Data atual:', hoje.toISOString());
    console.log('Mês/Ano atual:', mesAtual + 1, '/', anoAtual, '(lembrando que janeiro = 0)');
    console.log('Total de faturas carregadas:', faturas.length);
    
    // Log para verificar os valores que serão usados para comparação
    console.log('Mês atual (0-11):', mesAtual);
    console.log('Ano atual:', anoAtual);
    
    const resultado = {
      atual: null as Fatura | null,
      proximas: [] as Fatura[],
      passadas: [] as Fatura[]
    };

    faturas.forEach((fatura, index) => {
      const dataVencimento = new Date(fatura.dataVencimento);
      const mesVencimento = dataVencimento.getMonth();
      const anoVencimento = dataVencimento.getFullYear();
      
      console.log(`\nFatura ${index + 1}:`, {
        id: fatura.id,
        cartaoId: fatura.cartaoId,
        mes: mesVencimento + 1,
        ano: anoVencimento,
        dataVencimento: fatura.dataVencimento,
        valorTotal: fatura.valorTotal,
        status: fatura.status,
        itens: fatura.itens?.length || 0
      });
      
      console.log(`  Mês vencimento: ${mesVencimento + 1} (índice: ${mesVencimento}), Ano vencimento: ${anoVencimento}`);
      console.log(`  Comparando com mês atual: ${mesAtual + 1} (índice: ${mesAtual}), Ano atual: ${anoAtual}`);
      
      // Verifica se é do mês/ano atual
      if (mesVencimento === mesAtual && anoVencimento === anoAtual) {
        console.log('  -> Adicionando a fatura atual (mês/ano iguais)');
        resultado.atual = fatura;
      } 
      // Verifica se é do mês/ano futuro
      else if (anoVencimento > anoAtual || (anoVencimento === anoAtual && mesVencimento > mesAtual)) {
        console.log('  -> Adicionando a faturas próximas (futuro)');
        resultado.proximas.push(fatura);
      } 
      // É do passado
      else {
        console.log('  -> Adicionando a faturas passadas (passado)');
        resultado.passadas.push(fatura);
      }
    });

    // Ordena as faturas futuras por data de vencimento
    resultado.proximas.sort((a, b) => 
      new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime()
    );
    
    // Ordena as faturas passadas por data de vencimento (mais recente primeiro)
    resultado.passadas.sort((a, b) => 
      new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime()
    );

    console.log('Resultado final:', {
      atual: resultado.atual?.id || 'nenhuma',
      proximas: resultado.proximas.length,
      passadas: resultado.passadas.length
    });

    return resultado;
  }, [faturas]); // Removido dataAtual das dependências

  // Handlers
  const handleMesAnterior = () => setDataAtual(prev => subMonths(prev, 1));
  const handleProximoMes = () => setDataAtual(prev => addMonths(prev, 1));

  const handleSelecionarCartao = (cartaoId: string) => {
    const id = parseInt(cartaoId);
    setCartaoSelecionadoId(id);
    router.push(`/faturas?cartaoId=${cartaoId}`);
    
    // Recarregar faturas do novo cartão
    carregarFaturas(id);
  };

  const carregarFaturas = async (cartaoId: number) => {
    try {
      const faturasData = await api.buscarFaturas(cartaoId);
      setFaturas(faturasData);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
    }
  };

  const handlePagarFatura = (fatura: any) => {
    setFaturaSelecionada(fatura);
    setModalAberto(true);
  };

  const handleVerDetalhes = (fatura: any) => {
    setFaturaSelecionada(fatura);
    setModalDetalhesAberto(true);
  };

  const handleFecharDetalhes = () => {
    setModalDetalhesAberto(false);
    setFaturaSelecionada(null);
  };

  const handleProcessarPagamento = async (contaId: string, valor: number) => {
    if (!faturaSelecionada) return;
    
    try {
      setProcessando(true);
      
      // Usar a API real de pagamento de fatura com tipo 'bill_payment'
      await api.pagarFatura(faturaSelecionada.id, {
        accountId: parseInt(contaId),
        amount: valor,
        description: `Pagamento fatura ${faturaSelecionada.cardName}`,
        paymentDate: new Date().toISOString()
      });
      
      // Recarregar faturas após pagamento
      if (cartaoSelecionadoId) {
        await carregarFaturas(cartaoSelecionadoId);
      }
      
      setModalAberto(false);
      setFaturaSelecionada(null);
      toast.success('Pagamento realizado com sucesso! Transação registrada como pagamento de fatura.');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao processar pagamento');
    } finally {
      setProcessando(false);
    }
  };

  // Renderização condicional
  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 mb-4">{erro}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const cartaoAtual = cartoes.find(c => c.id === cartaoSelecionadoId);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Faturas</h1>
        <div />
      </div>

      {/* Seletor de Cartão */}
      <div className="flex items-center space-x-2">
        <CreditCard className="h-5 w-5" />
        <select
          value={cartaoSelecionadoId || ''}
          onChange={(e) => handleSelecionarCartao(e.target.value)}
          className="bg-transparent border-none focus:outline-none"
        >
          {cartoes.map((cartao) => {
            // Usando os últimos 4 caracteres do ID como fallback
            const ultimosDigitos = cartao.id.slice(-4);
            return (
              <option key={cartao.id} value={cartao.id}>
                {cartao.nome} •••• {ultimosDigitos}
              </option>
            );
          })}
        </select>
      </div>

      {/* Seletor de Mês/Ano */}
      <div className="flex items-center justify-between bg-card p-3 rounded-lg">
        <Button variant="ghost" size="icon" onClick={handleMesAnterior}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h2 className="text-lg font-semibold">
          {format(dataAtual, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        
        <Button variant="ghost" size="icon" onClick={handleProximoMes}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Abas */}
      <Tabs defaultValue="atual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="atual">Atual</TabsTrigger>
          <TabsTrigger value="proximas">Próximas</TabsTrigger>
          <TabsTrigger value="passadas">Passadas</TabsTrigger>
        </TabsList>

        {/* Conteúdo das abas */}
        <TabsContent value="atual" className="pt-4">
          {atual ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FaturaCard 
                key={atual.id} 
                fatura={atual} 
                cartao={cartaoAtual || null} 
                onPagarFatura={handlePagarFatura}
                onVerDetalhes={handleVerDetalhes}
              />
            </div>
          ) : (
            <ListaVazia 
              titulo="Nenhuma fatura atual"
              mensagem="Não há faturas para o período atual"
              icone="file-text"
            />
          )}
        </TabsContent>

        <TabsContent value="proximas" className="pt-4">
          {proximas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proximas.map((fatura) => (
                <FaturaCard
                  key={`${fatura.cartaoId}-${fatura.mes}-${fatura.ano}`}
                  fatura={fatura}
                  cartao={cartaoAtual || null}
                  onPagarFatura={handlePagarFatura}
                  onVerDetalhes={handleVerDetalhes}
                />
              ))}
            </div>
          ) : (
            <ListaVazia 
              titulo="Nenhuma fatura futura"
              mensagem="Não há faturas futuras agendadas"
              icone="calendar"
            />
          )}
        </TabsContent>

        <TabsContent value="passadas" className="pt-4">
          {passadas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {passadas.map((fatura) => (
                <FaturaCard
                  key={`${fatura.cartaoId}-${fatura.mes}-${fatura.ano}`}
                  fatura={fatura}
                  cartao={cartaoAtual || null}
                  onPagarFatura={handlePagarFatura}
                  onVerDetalhes={handleVerDetalhes}
                />
              ))}
            </div>
          ) : (
            <ListaVazia 
              titulo="Nenhuma fatura passada"
              mensagem="Não há faturas nos registros anteriores"
              icone="archive"
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Pagamento */}
      <ModalPagamento
        aberto={modalAberto}
        fatura={faturaSelecionada}
        cartao={faturaSelecionada ? (cartoes.find(c => c.id === faturaSelecionada.cartaoId) || null) : null}
        contas={[
          { id: '1', nome: 'Conta Corrente', saldo: 5000 },
          { id: '2', nome: 'Conta Poupança', saldo: 15000 },
        ]}
        onConfirmar={handleProcessarPagamento}
        onFechar={() => setModalAberto(false)}
      />

      {/* Modal de Detalhes */}
      <ModalDetalhesFatura
        aberto={modalDetalhesAberto}
        fatura={faturaSelecionada}
        cartao={faturaSelecionada ? (cartoes.find(c => c.id === faturaSelecionada.cartaoId) || null) : null}
        onFechar={handleFecharDetalhes}
      />
    </div>
  );
}
