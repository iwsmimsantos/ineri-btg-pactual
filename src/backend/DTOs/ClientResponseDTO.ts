// ClientResponseDTO.ts
export interface ClientResponseDTO {
  id: number;
  nome: string;
  perfilDeInvestidor: "conservador" | "moderado" | "arrojado";
  patrimonio: number;
}
