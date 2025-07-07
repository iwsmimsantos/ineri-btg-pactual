// src/app/dtos/ClientDetailsDTO.ts

export interface ClientDetailsDTO {
  id: number;
  nomeCompleto: string;
  email: string;
  cpf: string;
  saldoCarteira: number;
  ultimoContato: string;
  investments: InvestmentDTO[];
}

export interface InvestmentDTO {
  id: number;
  ativoId: number;
  quantidade: number;
  precoCompra: number;
}
