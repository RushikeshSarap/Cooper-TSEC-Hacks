export interface Wallet {
  eventId: string;
  balance: number;
}

export class WalletService {
  static async getWallet(eventId: string): Promise<Wallet> {
    // TODO: Fetch wallet from DB
    return {
      eventId,
      balance: 0
    };
  }

  static async deposit(
    eventId: string,
    userId: string,
    amount: number
  ): Promise<void> {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }

    // TODO:
    // 1. Call Finternet deposit API
    // 2. Lock funds to event wallet
    // 3. Store deposit record
  }

  static async deduct(
    eventId: string,
    amount: number
  ): Promise<void> {
    // TODO: Reduce wallet balance safely
  }
}
