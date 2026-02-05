import { Router } from "express";
import type { Request, Response } from "express";
import { WalletService } from "../services/wallet.service.js";

const router = Router();

/**
 * GET /api/v1/wallet/balance
 * Get current wallet balance
 */
router.get("/balance", async (req: Request, res: Response) => {
    try {
        const wallet = await WalletService.getWallet();
        res.status(200).json(wallet);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/v1/wallet/transactions
 * Get recent transactions
 */
router.get("/transactions", async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;
        const transactions = await WalletService.getTransactions(limit, offset);
        res.status(200).json(transactions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/v1/wallet/deposit
 * Create a payment intent to add funds
 */
router.post("/deposit", async (req: Request, res: Response) => {
    try {
        const { userId, amount, description } = req.body;
        
        if (!amount) {
             res.status(400).json({ error: "Amount is required" });
             return;
        }

        const result = await WalletService.deposit(
            userId || "default_user", 
            Number(amount), 
            description
        );
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
