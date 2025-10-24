import { apiClient } from "@/lib/api/client";
import { SubscriptionPlan } from "@/Types";

class SubscriptionPlanService {
    async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
        try {
            const response = await apiClient.get<SubscriptionPlan[]>('/subscription-plans');
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            throw error;
        }
    }
}

const subscriptionPlanService = new SubscriptionPlanService();
export default subscriptionPlanService;
