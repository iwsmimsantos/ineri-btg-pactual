// RecommendationResponseDTO.ts
export interface RecommendationResponseDTO {
  clienteId: number;
  produto: {
    nome: string;
    tipo: string;
    risco: string;
  };
  percentualRecomendado: number;
  dataRecomendacao: string;
}
