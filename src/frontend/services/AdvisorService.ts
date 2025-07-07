import { Config } from '../utils/config';

export interface AdvisorPreferences {
    preferenciaVolumeInvestido: number;
    preferenciaNivelDesenquadramento: number;
    preferenciaTempoSemContato: number;
}

export class AdvisorService {
    private static instance: AdvisorService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = Config.API.BASE_URL;
    }

    public static getInstance(): AdvisorService {
        if (!AdvisorService.instance) {
            AdvisorService.instance = new AdvisorService();
        }
        return AdvisorService.instance;
    }

    private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        console.log('Making request to:', url);
        console.log('Request options:', options);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.status === 204) {
                // @ts-ignore
                return undefined;
            }

            const data = await response.json();
            console.log('Response data:', data);
            return data;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }

    public async getPreferences(advisorId: number): Promise<AdvisorPreferences> {
        const endpoint = Config.API.ENDPOINTS.ADVISORS + `/${advisorId}/preferences`;
        return this.makeRequest<AdvisorPreferences>(endpoint);
    }

    public async updatePreferences(advisorId: number, preferences: AdvisorPreferences): Promise<void> {
        const endpoint = Config.API.ENDPOINTS.ADVISORS + `/${advisorId}/preferences`;
        await this.makeRequest(endpoint, {
            method: 'PUT',
            body: JSON.stringify(preferences),
        });
    }
} 