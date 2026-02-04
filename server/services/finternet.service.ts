import axios from "axios";

const API_KEY = process.env.FINTERNET_API_KEY!;
const BASE_URL = process.env.FINTERNET_BASE_URL!;

/**
 * PaymentIntent type returned by Finternet
 */
export interface PaymentIntent {
  id: string;
  status: string;
  amount: string;
  currency: string;
  paymentUrl: string;
  metadata?: Record<string, any>;
}

/**
 * Create a payment intent
 */
export const createPaymentIntent = async (
  amount: string,
  currency: string,
  description?: string
): Promise<PaymentIntent> => {
  try {
    const body = {
      amount,
      currency,
      type: "DELIVERY_VS_PAYMENT",
      settlementMethod: "OFF_RAMP_MOCK",
      settlementDestination: "bank_account_123", // Replace with real destination
      description: description || "Payment from Hackathon App",
    };

    const res = await axios.post(`${BASE_URL}/payment-intents`, body, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
    });

    return res.data.data as PaymentIntent;
  } catch (err: any) {
    console.error("Finternet Create Payment Error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Get payment intent by ID
 */
export const getPaymentIntent = async (intentId: string): Promise<PaymentIntent> => {
  try {
    const res = await axios.get(`${BASE_URL}/payment-intents/${intentId}`, {
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    return res.data.data as PaymentIntent;
  } catch (err: any) {
    console.error("Finternet Get Payment Intent Error:", err.response?.data || err.message);
    throw err;
  }
};
