import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required env vars early
const REQUIRED_ENV_VARS = ["PORT", "JWT_SECRET"];
REQUIRED_ENV_VARS.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
});

const PORT = Number(process.env.PORT);

// Initialize Express app
const app: Application = express();

/* =========================
   Global Middlewares
========================= */

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

/* =========================
   Health Check
========================= */

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    service: "Cooper – Collective Spend Control API",
    timestamp: new Date().toISOString()
  });
});

/* =========================
   API Routes
========================= */

// (Routes will be implemented later)
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import walletRoutes from "./routes/wallet.routes";
import categoryRoutes from "./routes/category.routes";
import paymentRoutes from "./routes/payment.routes";
import settlementRoutes from "./routes/settlement.routes";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/wallets", walletRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/settlements", settlementRoutes);

/* =========================
   404 Handler
========================= */

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

/* =========================
   Global Error Handler
========================= */

app.use(
  (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response
  ) => {
    console.error("❌ Error:", err.message);

    res.status(err.statusCode || 500).json({
      error: err.message || "Internal Server Error"
    });
  }
);

/* =========================
   Start Server
========================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
