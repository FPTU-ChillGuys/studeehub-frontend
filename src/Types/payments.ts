export interface PaymentResponse {
    bin: string,
    accountNumber: string,
    amount: number,
    description: string,
    orderCode: number,
    currency: string,
    paymentLinkId: string,
    status: string,
    expiredAt: number,
    checkoutUrl: string,
    qrCode: string
}

export interface PaymentRequest {
    description: string,
    returnUrl: string,
    cancelUrl: string,
    userId: string,
    subscriptionPlanId: string
}