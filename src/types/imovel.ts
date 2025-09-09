export interface Imovel {
  id: string;
  endereco: string;
  inquilino: string;
  valor: number;
  dataVencimento: number; // Dia do mês
  statusPagamento: boolean;
  ultimoPagamento?: string;
  inicioContrato: string;
  fimContrato: string;
  diasAtraso?: number;
}

export type StatusFiltro = 'todos' | 'pagos' | 'pendentes';