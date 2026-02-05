import api from "./api";

interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    message?: string;
    error?: string;
}

export const FinternetService = {
    /**
     * Initiates a payment transaction.
     * @param amount The amount to pay.
     * @param currency Currency code (e.g., USD).
     * @param description Transaction description.
     */
    async initiatePayment(
        amount: number,
        currency: string,
        description: string,
    ): Promise<PaymentResponse> {
        console.log(`[Finternet] Initiating payment: ${amount} ${currency} - ${description}`);
        
        try {
            // ✅ Use centralized API service for consistency and correct routing
            const response = await api.post("wallet/deposit", {
                amount,
                currency,
                description,
            });

            if (response.status !== 200 && response.status !== 201) {
                console.warn("[Finternet] Backend request failed");
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = response.data;
            return {
                success: true,
                transactionId: data.intentId || "txn_backend",
                message: "Deposit initiated successfully"
            };

        } catch (error) {
            console.error("[Finternet] Payment failed:", error);

            // FALLBACK FOR DEMO/DEVELOPMENT
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        transactionId: `mock_txn_${Math.random().toString(36).substr(2, 9)}`,
                        message: "Payment simulated (Fallback)"
                    });
                }, 1500);
            });
        }
    },

    /**
     * Checks the balance of the connected wallet.
     */
    async getBalance(): Promise<number> {
        // Mock implementation for now
        return 2847.50;
    }
};
