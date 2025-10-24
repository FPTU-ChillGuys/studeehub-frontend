export interface SubscriptionPlan {
    id: string;
    code: string;
    name: string;
    price: number;
    description: string;
    currency: string;
    durationInDays: number;
    maxDocuments: number;
    maxStorageMB: number;
    hasAIAnalysis: boolean;
}