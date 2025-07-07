import { Config } from '../utils/config';
import { ClientClassificationSummary } from '../models/ClientClassification';
import { ClientResponse } from '../models/Client';

export class ClientClassificationService {
    private static instance: ClientClassificationService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = `${Config.API.BASE_URL}/client-classifications`;
    }

    public static getInstance(): ClientClassificationService {
        if (!ClientClassificationService.instance) {
            ClientClassificationService.instance = new ClientClassificationService();
        }
        return ClientClassificationService.instance;
    }

    private transformClientResponse(backendClient: ClientResponse): any {
        return {
            id: backendClient.id.toString(),
            name: backendClient.nome,
            profileType: `Perfil: ${backendClient.perfilDeInvestidor}`,
            portfolioType: `Perfil da Carteira: ${backendClient.perfilCarteira}`,
            percentage: Math.round(backendClient.percentualDesenquadramento),
            status: backendClient.isDesenquadrado ? 'desenquadrado' : 'normal'
        };
    }

    private transformClassificationResponse(response: any): ClientClassificationSummary {
        return {
            priorityClient: response.priorityClient ? this.transformClientResponse(response.priorityClient) : null,
            highInvestmentCount: response.highInvestmentCount,
            criticalMismatchCount: response.criticalMismatchCount,
            highExposureCount: response.highExposureCount,
            classifications: response.classifications.map((classification: any) => ({
                title: classification.title,
                subtitle: classification.subtitle,
                icon: classification.icon,
                clients: classification.clients.map((client: any) => this.transformClientResponse(client))
            }))
        };
    }

    private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), Config.API.TIMEOUT);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
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
                throw new Error('A requisição demorou demais para responder. Verifique sua conexão e tente novamente.');
            }

            throw error;
        }
    }

    public async getClassificationSummary(advisorId: number): Promise<ClientClassificationSummary> {
        try {
            const data = await this.makeRequest<any>(`/advisor/${advisorId}/summary`);
            return this.transformClassificationResponse(data);
        } catch (error) {
            console.error('Error fetching classification summary:', error);
            throw error;
        }
    }

    public async getRandomClientsFromAllAdvisors(limit: number): Promise<ClientResponse[]> {
        try {
            const data = await this.makeRequest<ClientResponse[]>(`/random-clients?limit=${limit}`);
            return data;
        } catch (error) {
            console.error('Error fetching random clients:', error);
            throw error;
        }
    }
} 