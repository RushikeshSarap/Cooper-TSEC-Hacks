export interface PaymentRule {
  eventId: string;
  maxAmount: number;
  allowedRoles: ("organizer" | "member")[];
  approvalRequired: boolean;
}

export class RuleService {
  static async getRule(eventId: string): Promise<PaymentRule> {
    // TODO: Fetch rule from DB
    return {
      eventId,
      maxAmount: 5000,
      allowedRoles: ["organizer"],
      approvalRequired: false
    };
  }

  static validatePayment(
    rule: PaymentRule,
    role: string,
    amount: number
  ): void {
    if (!rule.allowedRoles.includes(role as any)) {
      throw new Error("User not allowed to make payment");
    }

    if (amount > rule.maxAmount) {
      throw new Error("Payment exceeds allowed limit");
    }
  }
}
