import { WalletService } from "./wallet.service.js";
import { RuleService } from "./rule.service.js";

export interface PaymentInput {
  eventId: string;
  categoryId: string;
  paidBy: string;
  role: string;
  amount: number;
}

export class PaymentService {
  static async makePayment(input: PaymentInput): Promise<void> {
    const { eventId, role, amount } = input;

    // 1️⃣ Validate rules
    const rule = await RuleService.getRule(eventId);
    RuleService.validatePayment(rule, role, amount);

    // 2️⃣ Check wallet balance
    const wallet = await WalletService.getWallet(eventId);
    if (wallet.balance < amount) {
      throw new Error("Insufficient pooled balance");
    }

    
    // 3️⃣ Call Finternet payment API (TODO)
    // 4️⃣ Deduct from wallet
    await WalletService.deduct(eventId, amount);

    // 5️⃣ Store payment record (TODO)
  }
}
