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

    async getSubscriptionPlanById(planId: string): Promise<SubscriptionPlan | null> {
        try {
            const response = await apiClient.get<SubscriptionPlan>(`/subscription-plans/${planId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription plan:', error);
            return null;
        }
    }

    async createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id'>): Promise<boolean> {
        try {
            const response = await apiClient.post('/subscription-plans', plan);
            return response.success;
        } catch (error) {
            console.error('Error creating subscription plan:', error);
            return false;
        }
    }

    async updateSubscriptionPlan(plan: SubscriptionPlan): Promise<boolean> {
        try {
            const response = await apiClient.put(`/subscription-plans/${plan.id}`, plan);
            return response.success;
        } catch (error) {
            console.error('Error updating subscription plan:', error);
            return false;
        }
    }

    async deleteSubscriptionPlan(planId: string): Promise<boolean> {
        try {
            const response = await apiClient.delete(`/subscription-plans/${planId}`);
            return response.success;
        } catch (error) {
            console.error('Error deleting subscription plan:', error);
            return false;
        }
    }
}

const subscriptionPlanService = new SubscriptionPlanService();
export default subscriptionPlanService;
