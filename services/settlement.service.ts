export interface SettlementInput {
  userId: string;
  deposited: number;
  spent: number;
}

export interface SettlementResult {
  userId: string;
  finalShare: number;
  refund: number;
}

export class SettlementService {
  static calculate(
    input: SettlementInput
  ): SettlementResult {
    const refund = input.deposited - input.spent;

    return {
      userId: input.userId,
      finalShare: input.spent,
      refund: refund > 0 ? refund : 0
    };
  }

  static async settleEvent(eventId: string): Promise<void> {
    // TODO:
    // 1. Get all participants
    // 2. Calculate per-category shares
    // 3. Compute settlement per user
    // 4. Trigger refunds via Finternet
    // 5. Mark event as settled
  }
}
