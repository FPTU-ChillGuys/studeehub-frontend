import subscriptionPlanService from "@/service/subscriptionPlanService";
import { SubscriptionPlan } from "@/Types";

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await subscriptionPlanService.getSubscriptionPlans();
    return response;
}

export async function getSubscriptionPlanById(planId: string): Promise<SubscriptionPlan | null> {
    const response = await subscriptionPlanService.getSubscriptionPlanById(planId);
    return response;
}

export async function createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id'>): Promise<boolean> {
    const response = await subscriptionPlanService.createSubscriptionPlan(plan);
    return response;
}

export async function updateSubscriptionPlan(plan: SubscriptionPlan): Promise<boolean> {
    const response = await subscriptionPlanService.updateSubscriptionPlan(plan);
    return response;
}

export async function deleteSubscriptionPlan(planId: string): Promise<boolean> {
    const response = await subscriptionPlanService.deleteSubscriptionPlan(planId);
    return response;
}
