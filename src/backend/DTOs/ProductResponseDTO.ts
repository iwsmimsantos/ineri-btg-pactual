// ProductResponseDTO.ts
export interface ProductResponseDTO {
  id: number;
  nome: string;
  tipo: "ação" | "fundo imobiliário" | "renda fixa" | "fundo de investimento";
  risco: "baixo" | "médio" | "alto";
  rentabilidadeHistorica?: number;
}
