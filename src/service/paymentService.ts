import { apiClient } from "@/lib/api/client";
import { PaymentRequest, PaymentResponse } from "@/Types";

class PaymentService {
    async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
        try {
            const response = await apiClient.post<PaymentResponse>('/payments/payos/links', paymentRequest);
            return response.data;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    }
}

const paymentService = new PaymentService();
export default paymentService;
