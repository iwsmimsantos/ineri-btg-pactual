import { Client, ClientResponse, ClientDetails } from '../models/Client';
import { Config } from '../utils/config';

export interface RiskFactors {
  portfolio_risk: number;
  investment_duration: number;
  diversification: number;
  market_exposure: number;
}

export interface RiskFactorAnalysis {
  value: number;
  weight: number;
  description: string;
}

export interface ClientRiskAnalysis {
  investorProfile: string;
  portfolioProfile: string;
  mismatchPercentage: number;
  isSignificantMismatch: boolean;
  riskFactors: RiskFactors;
  calculatedRiskScore: number;
  riskFactorAnalysis: {
    portfolioRisk: RiskFactorAnalysis;
    investmentDuration: RiskFactorAnalysis;
    diversification: RiskFactorAnalysis;
    marketExposure: RiskFactorAnalysis;
  };
}

export interface CalculatedRiskHistory {
  id: number;
  clienteId: number;
  riscoCalculado: number;
  dadosCalculo: Record<string, any>;
  dataCalculo: string;
}

export interface DeclaredRiskHistory {
  id: number;
  clienteId: number;
  riscoDeclarado: number;
  respostasQuestionario: Record<string, any>;
  dataDeclaracao: string;
}

export interface RiskHistory {
  calculatedHistory: CalculatedRiskHistory[];
  declaredHistory: DeclaredRiskHistory[];
}

export class ClientService {
  private static instance: ClientService;

  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), Config.API.TIMEOUT);

    try {
      const response = await fetch(`${Config.API.BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (Config.FEATURES.ENABLE_DEBUG_LOGS) {
        console.error('API request failed:', {
          endpoint,
          error: error instanceof Error ? error.message : error,
        });
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }

      throw error;
    }
  }

  async getAllClients(): Promise<ClientResponse[]> {
    return this.makeRequest<ClientResponse[]>('/clients');
  }

  async getClientById(id: number): Promise<ClientResponse> {
    return this.makeRequest<ClientResponse>(`/clients/${id}`);
  }

  async getClientByEmail(email: string): Promise<Client> {
    return this.makeRequest<Client>(`/clients/email/${email}`);
  }

  async getClientByCpf(cpf: string): Promise<Client> {
    return this.makeRequest<Client>(`/clients/cpf/${cpf}`);
  }

  async getClientsByAdvisor(advisorId: number, page = 1, pageSize = 10): Promise<{ clients: ClientResponse[]; totalCount: number; page: number; pageSize: number }> {
    return this.makeRequest<{ clients: ClientResponse[]; totalCount: number; page: number; pageSize: number }>(`/clients/advisor/${advisorId}?page=${page}&pageSize=${pageSize}`);
  }

  async getClientWithInvestments(id: number): Promise<Client> {
    return this.makeRequest<Client>(`/clients/${id}/investments`);
  }

  async getClientRiskFactors(id: number): Promise<RiskFactors> {
    return this.makeRequest<RiskFactors>(`/clients/${id}/risk-factors`);
  }

  async calculateAndSaveRisk(id: number): Promise<CalculatedRiskHistory> {
    return this.makeRequest<CalculatedRiskHistory>(`/clients/${id}/calculate-risk`, {
      method: 'POST',
    });
  }

  async getClientRiskHistory(id: number): Promise<RiskHistory> {
    return this.makeRequest<RiskHistory>(`/clients/${id}/risk-history`);
  }

  async getClientRiskAnalysis(id: number): Promise<ClientRiskAnalysis> {
    return this.makeRequest<ClientRiskAnalysis>(`/clients/${id}/risk-analysis`);
  }

  async createClient(client: Omit<Client, 'id' | 'dataCriacao'>): Promise<Client> {
    return this.makeRequest<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  async updateClient(id: number, client: Client): Promise<void> {
    await this.makeRequest<void>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  }

  async deleteClient(id: number): Promise<void> {
    await this.makeRequest<void>(`/clients/${id}`, {
      method: 'DELETE',
    });
  }
}
