import { Router } from "express";
import type { Request, Response } from "express";
import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Initialize Mistral AI client
// Note: Ensure MISTRAL_API_KEY is in your .env file
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

let lastCallTime = 0;

// Slow down requests if needed (optional)
async function slowDown(minDelayMs: number): Promise<void> {
    const now = Date.now();
    const waitTime = lastCallTime + minDelayMs - now;
    if (waitTime > 0) {
        console.log(`⏳ Waiting ${waitTime}ms before sending API request...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    lastCallTime = Date.now();
}

// Route handler
router.post("/agent", async (req: Request, res: Response): Promise<void> => {
    try {
        const { prompt } = req.body as { prompt: string };

        console.log("🔥 Prompt received:", prompt);

        const systemPrompt = `
You are a Travel Planner AI Agent.

Extract:
- destination
- budget
- group size
- number of days

If any detail is missing → ask a follow up question.
If all info is available → provide:
- best transport mode
- places to visit
- fun activities
- total estimated costs
- 3–5 day itinerary
    `;

        await slowDown(1500); // slows requests by 1.5 seconds (optional)

        const response = await mistral.chat.complete({
            model: "mistral-small-latest",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
        });

        // Mistral response type handling might vary, assuming choices exists
        const reply = response?.choices?.[0]?.message?.content || "No response generated.";
        res.json({ response: reply });

    } catch (error: any) {
        console.error("❌ MISTRAL ERROR:", error);
        res.status(500).json({
            error: "Mistral API error",
            details: error?.message || "Unknown error"
        });
    }
});

export default router;
