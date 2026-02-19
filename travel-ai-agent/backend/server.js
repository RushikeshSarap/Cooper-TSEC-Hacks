import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {Mistral} from "@mistralai/mistralai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Mistral AI client
const mistral = new Mistral(process.env.MISTRAL_API_KEY);

let lastCallTime = 0;

// Slow down requests if needed (optional)
async function slowDown(minDelayMs) {
  const now = Date.now();
  const waitTime = lastCallTime + minDelayMs - now;
  if (waitTime > 0) {
    console.log(`⏳ Waiting ${waitTime}ms before sending API request...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  lastCallTime = Date.now();
}

app.post("/api/agent", async (req, res) => {
  try {
    const { prompt } = req.body;

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

    const reply = response.choices[0].message.content;
    res.json({ response: reply });

  } catch (error) {
    console.error("❌ MISTRAL ERROR:", error);
    res.status(500).json({
      error: "Mistral API error",
      details: error.message
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("🚀 Mistral Travel AI running on port " + process.env.PORT);
});
