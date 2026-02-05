import { getAccountBalance, getLedgerEntries, createPaymentIntent } from "./finternet.service";

export interface Wallet {
  available: number;
  pending: number;
  currency: string;
}

export class WalletService {
  /**
   * Get the current user/merchant wallet balance from Finternet
   */
  static async getWallet(): Promise<Wallet> {
     // In a real app, you might look up the specific merchant ID for the user
     // For this hackathon, we assume a single merchant account
     return await getAccountBalance();
  }

  /**
   * Get recent transactions
   */
  static async getTransactions(limit: number = 10, offset: number = 0) {
      return await getLedgerEntries(limit, offset);
  }

  /**
   * Initiate a deposit via Finternet Payment Intent
   */
  static async deposit(
    userId: string,
    amount: number,
    descriptor: string = "Wallet Deposit"
  ): Promise<{ paymentUrl: string; intentId: string }> {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }

    // Create a payment intent on Finternet
    // We treat this as a "checkout" to add funds to the merchant wallet (which represents the group pool)
    const intent = await createPaymentIntent(
        amount.toString(), 
        "USD", 
        descriptor
    );

    return {
        paymentUrl: intent.paymentUrl,
        intentId: intent.id
    };
  }

  static async deduct(
    eventId: string,
    amount: number
  ): Promise<void> {
    // TODO: Reduce wallet balance safely (Internal accounting)
    // Finternet doesn't have a direct "deduct" API for the merchant balance unless we payout.
    // For internal splitwise logic, we just track it in our DB usually.
  }
}
