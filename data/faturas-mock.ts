import { Fatura } from "@/app/faturas/page";

export const faturasMock: Fatura[] = [
  {
    id: 'f1',
    cartaoId: '1',
    mes: 7, // Julho
    ano: 2025,
    dataVencimento: '2025-08-20',
    dataFechamento: '2025-08-10',
    valorTotal: 1250.75,
    valorPago: 1250.75,
    status: 'paga',
    itens: [
      { id: 'i1', descricao: 'Mercado', valor: 350.50, data: '2025-07-15', categoria: 'alimentacao' },
      { id: 'i2', descricao: 'Restaurante', valor: 120.25, data: '2025-07-18', categoria: 'alimentacao' },
      { id: 'i3', descricao: 'Supermercado', valor: 280.00, data: '2025-07-22', categoria: 'alimentacao' },
      { id: 'i4', descricao: 'Combustível', valor: 250.00, data: '2025-07-25', categoria: 'transporte' },
      { id: 'i5', descricao: 'Cinema', valor: 80.00, data: '2025-07-28', categoria: 'lazer' },
      { id: 'i6', descricao: 'Farmácia', valor: 120.00, data: '2025-07-30', categoria: 'saude' },
      { id: 'i7', descricao: 'Assinatura Streaming', valor: 30.00, data: '2025-08-01', categoria: 'lazer' },
    ]
  },
  {
    id: 'f2',
    cartaoId: '1',
    mes: 8, // Agosto (atual)
    ano: 2025,
    dataVencimento: '2025-09-20',
    dataFechamento: '2025-09-10',
    valorTotal: 1850.30,
    status: 'aberta',
    itens: [
      { id: 'i8', descricao: 'Mercado', valor: 420.30, data: '2025-08-12', categoria: 'alimentacao' },
      { id: 'i9', descricao: 'Restaurante', valor: 180.75, data: '2025-08-15', categoria: 'alimentacao' },
      { id: 'i10', descricao: 'Combustível', valor: 230.00, data: '2025-08-18', categoria: 'transporte' },
      { id: 'i11', descricao: 'Farmácia', valor: 89.90, data: '2025-08-20', categoria: 'saude' },
      { id: 'i12', descricao: 'Compras Online', valor: 329.80, data: '2025-08-22', categoria: 'outros' },
      { id: 'i13', descricao: 'Assinatura Streaming', valor: 29.99, data: '2025-08-25', categoria: 'lazer' },
      { id: 'i14', descricao: 'Manutenção Carro', valor: 569.56, data: '2025-08-28', categoria: 'transporte' },
    ]
  },
  {
    id: 'f3',
    cartaoId: '2',
    mes: 8, // Agosto (atual)
    ano: 2025,
    dataVencimento: '2025-09-15',
    dataFechamento: '2025-09-05',
    valorTotal: 1250.75,
    status: 'aberta',
    itens: [
      { id: 'i15', descricao: 'Mercado', valor: 320.50, data: '2025-08-10', categoria: 'alimentacao' },
      { id: 'i16', descricao: 'Restaurante', valor: 150.25, data: '2025-08-15', categoria: 'alimentacao' },
      { id: 'i17', descricao: 'Combustível', valor: 200.00, data: '2025-08-20', categoria: 'transporte' },
      { id: 'i18', descricao: 'Farmácia', valor: 129.90, data: '2025-08-22', categoria: 'saude' },
      { id: 'i19', descricao: 'Compras Online', valor: 450.10, data: '2025-08-25', categoria: 'outros' },
    ]
  },
  {
    id: 'f4',
    cartaoId: '1',
    mes: 6, // Junho
    ano: 2025,
    dataVencimento: '2025-07-20',
    dataFechamento: '2025-07-10',
    valorTotal: 980.25,
    valorPago: 980.25,
    status: 'paga',
    itens: [
      { id: 'i20', descricao: 'Mercado', valor: 280.75, data: '2025-06-12', categoria: 'alimentacao' },
      { id: 'i21', descricao: 'Restaurante', valor: 95.50, data: '2025-06-18', categoria: 'alimentacao' },
      { id: 'i22', descricao: 'Combustível', valor: 210.00, data: '2025-06-20', categoria: 'transporte' },
      { id: 'i23', descricao: 'Cinema', valor: 75.00, data: '2025-06-22', categoria: 'lazer' },
      { id: 'i24', descricao: 'Farmácia', valor: 89.00, data: '2025-06-25', categoria: 'saude' },
      { id: 'i25', descricao: 'Compras Online', valor: 230.00, data: '2025-06-28', categoria: 'outros' },
    ]
  },
  {
    id: 'f5',
    cartaoId: '2',
    mes: 7, // Julho
    ano: 2025,
    dataVencimento: '2025-08-15',
    dataFechamento: '2025-08-05',
    valorTotal: 1750.90,
    valorPago: 1750.90,
    status: 'paga',
    itens: [
      { id: 'i26', descricao: 'Mercado', valor: 380.25, data: '2025-07-10', categoria: 'alimentacao' },
      { id: 'i27', descricao: 'Restaurante', valor: 145.75, data: '2025-07-15', categoria: 'alimentacao' },
      { id: 'i28', descricao: 'Combustível', valo: 220.00, data: '2025-07-18', categoria: 'transporte' },
      { id: 'i29', descricao: 'Manutenção Carro', valor: 450.00, data: '2025-07-20', categoria: 'transporte' },
      { id: 'i30', descricao: 'Compras Online', valor: 355.90, data: '2025-07-25', categoria: 'outros' },
      { id: 'i31', descricao: 'Farmácia', valor: 99.00, data: '2025-07-28', categoria: 'saude' },
      { id: 'i32', descricao: 'Cinema', valor: 60.00, data: '2025-07-30', categoria: 'lazer' },
      { id: 'i33', descricao: 'Assinatura Streaming', valor: 40.00, data: '2025-08-01', categoria: 'lazer' },
    ]
  },
  {
    id: 'f6',
    cartaoId: '1',
    mes: 9, // Setembro (próximo mês)
    ano: 2025,
    dataVencimento: '2025-10-20',
    dataFechamento: '2025-10-10',
    valorTotal: 0,
    status: 'aberta',
    itens: []
  },
  {
    id: 'f7',
    cartaoId: '2',
    mes: 9, // Setembro (próximo mês)
    ano: 2025,
    dataVencimento: '2025-10-15',
    dataFechamento: '2025-10-05',
    valorTotal: 0,
    status: 'aberta',
    itens: []
  },
  {
    id: 'f8',
    cartaoId: '1',
    mes: 5, // Maio
    ano: 2025,
    dataVencimento: '2025-06-20',
    dataFechamento: '2025-06-10',
    valorTotal: 890.50,
    valorPago: 890.50,
    status: 'paga',
    itens: [
      { id: 'i34', descricao: 'Mercado', valor: 250.75, data: '2025-05-12', categoria: 'alimentacao' },
      { id: 'i35', descricao: 'Restaurante', valor: 85.25, data: '2025-05-15', categoria: 'alimentacao' },
      { id: 'i36', descricao: 'Combustível', valor: 190.00, data: '2025-05-18', categoria: 'transporte' },
      { id: 'i37', descricao: 'Farmácia', valor: 75.50, data: '2025-05-20', categoria: 'saude' },
      { id: 'i38', descricao: 'Compras Online', valo: 199.00, data: '2025-05-22', categoria: 'outros' },
      { id: 'i39', descricao: 'Cinema', valor: 60.00, data: '2025-05-25', categoria: 'lazer' },
      { id: 'i40', descricao: 'Assinatura Streaming', valor: 30.00, data: '2025-05-28', categoria: 'lazer' },
    ]
  },
  {
    id: 'f9',
    cartaoId: '2',
    mes: 6, // Junho
    ano: 2025,
    dataVencimento: '2025-07-15',
    dataFechamento: '2025-07-05',
    valorTotal: 1520.80,
    valorPago: 1520.80,
    status: 'paga',
    itens: [
      { id: 'i41', descricao: 'Mercado', valor: 320.25, data: '2025-06-10', categoria: 'alimentacao' },
      { id: 'i42', descricao: 'Restaurante', valor: 135.75, data: '2025-06-15', categoria: 'alimentacao' },
      { id: 'i43', descricao: 'Combustível', valor: 210.00, data: '2025-06-18', categoria: 'transporte' },
      { id: 'i44', descricao: 'Manutenção Carro', valor: 395.00, data: '2025-06-20', categoria: 'transporte' },
      { id: 'i45', descricao: 'Compras Online', valor: 310.80, data: '2025-06-25', categoria: 'outros' },
      { id: 'i46', descricao: 'Farmácia', valor: 89.00, data: '2025-06-28', categoria: 'saude' },
      { id: 'i47', descricao: 'Cinema', valor: 60.00, data: '2025-06-30', categoria: 'lazer' },
    ]
  },
  {
    id: 'f10',
    cartaoId: '1',
    mes: 10, // Outubro (mês futuro)
    ano: 2025,
    dataVencimento: '2025-11-20',
    dataFechamento: '2025-11-10',
    valorTotal: 0,
    status: 'aberta',
    itens: []
  },
  {
    id: 'f11',
    cartaoId: '2',
    mes: 10, // Outubro (mês futuro)
    ano: 2025,
    dataVencimento: '2025-11-15',
    dataFechamento: '2025-11-05',
    valorTotal: 0,
    status: 'aberta',
    itens: []
  },
  {
    id: 'f12',
    cartaoId: '1',
    mes: 4, // Abril
    ano: 2025,
    dataVencimento: '2025-05-20',
    dataFechamento: '2025-05-10',
    valorTotal: 1120.30,
    valorPago: 1120.30,
    status: 'paga',
    itens: [
      { id: 'i48', descricao: 'Mercado', valor: 310.50, data: '2025-04-10', categoria: 'alimentacao' },
      { id: 'i49', descricao: 'Restaurante', valor: 145.80, data: '2025-04-15', categoria: 'alimentacao' },
      { id: 'i50', descricao: 'Combustível', valor: 220.00, data: '2025-04-18', categoria: 'transporte' },
      { id: 'i51', descricao: 'Manutenção Carro', valor: 0, data: '2025-04-20', categoria: 'transporte' },
      { id: 'i52', descricao: 'Compras Online', valor: 344.00, data: '2025-04-25', categoria: 'outros' },
      { id: 'i53', descricao: 'Farmácia', valor: 0, data: '2025-04-28', categoria: 'saude' },
      { id: 'i54', descricao: 'Cinema', valor: 60.00, data: '2025-04-30', categoria: 'lazer' },
      { id: 'i55', descricao: 'Assinatura Streaming', valor: 40.00, data: '2025-05-01', categoria: 'lazer' },
    ]
  },
];
