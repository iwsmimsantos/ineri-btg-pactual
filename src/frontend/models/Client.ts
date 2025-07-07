export interface Client {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  assessorId: number;
  dataCriacao: string;
  ativo: boolean;
  investimentos?: Investment[];
  // Additional properties from backend risk calculation
  perfilDeInvestidor?: string;
  perfilCarteira?: string;
  riscoDeclarado?: number;
  riscoCalculado?: number;
  riscoCarteiraAtual?: number;
  percentualDesenquadramento?: number;
  isDesenquadrado?: boolean;
  ultimaAtualizacaoRisco?: string;
}

export interface ClientResponse {
  id: number;
  nome: string;
  perfilDeInvestidor: string;
  patrimonio: number;
  perfilCarteira: string;
  riscoDeclarado?: number;
  riscoCalculado?: number;
  riscoCarteiraAtual: number;
  percentualDesenquadramento: number;
  isDesenquadrado: boolean;
  ultimaAtualizacaoRisco?: string;
}

export interface ClientDetails {
  id: number;
  nomeCompleto: string;
  email: string;
  cpf: string;
  saldoCarteira: number;
  ultimoContato: string;
  investments: Investment[];
}

export interface Investment {
  id: number;
  ativoId: number;
  quantidade: number;
  precoCompra: number;
  valorTotal?: number;
  ativo?: Asset;
}

export interface Asset {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  categoria?: string;
  precoAtual: number;
  rentabilidade?: number;
  risco?: number;
}

export interface ClientCardData {
  id: string;
  name: string;
  profileType: string;
  portfolioType: string;
  percentage: number;
  status: 'desenquadrado' | 'normal';
}

export interface ClientFilters {
  searchText: string;
  filterType: 'todos' | 'desenquadrados' | 'novos';
}
