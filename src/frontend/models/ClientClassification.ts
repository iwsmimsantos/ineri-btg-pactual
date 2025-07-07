import { ClientCardData } from './Client';

export interface ClientClassificationData {
    title: string;
    subtitle: string;
    icon: string;
    clients: ClientCardData[];
}

export interface ClientClassificationSummary {
    priorityClient: ClientCardData | null;
    highInvestmentCount: number;
    criticalMismatchCount: number;
    highExposureCount: number;
    classifications: ClientClassificationData[];
} 