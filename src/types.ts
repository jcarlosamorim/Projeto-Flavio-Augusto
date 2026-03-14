export interface ProductInfo {
  name: string;
  description: string;
  price: string;
}

export interface SalesMetrics {
  currentStep: number;
  rapport: number; // 0-100
  needsDiscovery: number; // 0-100
  valueProposition: number; // 0-100
  objectionHandling: number; // 0-100
  closingProbability: number; // 0-100
  feedback: string;
}

export const SALES_STEPS = [
  "Preparação",
  "Abordagem",
  "Levantamento de Necessidades",
  "Proposta de Valor",
  "Negociação",
  "Fechamento",
  "Pós-Venda"
];
