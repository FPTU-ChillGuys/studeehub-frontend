import { apiClient, APIResponse } from "@/lib/api/client";
import { Subscription, SubscriptionFilters, SubscriptionsResponse } from "@/Types";

class SubscriptionService {
        async getSubscriptions(filters: SubscriptionFilters): Promise<APIResponse<SubscriptionsResponse>> {
             try {
                const response = await apiClient.get<SubscriptionsResponse>('/subscriptions',{
                    params: { ...filters }
                });
                if (!response.success) {
                    throw new Error('Failed to fetch subscriptions');
                }
                // API trả về response.data có cấu trúc SubscriptionsResponse
                console.log("Fetched subscriptions data:", response);
                return response;
             } catch (error) {
                 console.error("Error fetching subscriptions:", error);
                 throw error;
             }
        }

        async createSubscription(data: { userId: string; subscriptionPlanId: string; status: number; }): Promise<boolean> {
               try {
                 const response = await apiClient.post<unknown>('/subscriptions', data);
                 return response.success;
               } catch (error) {
                   console.error("Error creating subscription:", error);
                   throw error;
               }
        }

        // updateSubscription(id: string, data: SubscriptionData): Promise<Subscription> {
        //         // Implement API call to update an existing subscription
        // }

        // deleteSubscription(id: string): Promise<void> {
        //         // Implement API call to delete a subscription
        // }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
