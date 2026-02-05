import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initSchema } from "./config/initSchema.js";
import { connectDB } from "./config/db.config.js";

// Load environment variables
dotenv.config();

// Validate required env vars early
const REQUIRED_ENV_VARS = ["PORT", "JWT_SECRET"];
REQUIRED_ENV_VARS.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
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

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import ruleRoutes from "./routes/rule.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/rules", ruleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1", chatbotRoutes);

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   Static Files & Client Routing
========================= */

// Serve static files from the client/dist directory
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

/* =========================
   404 Handler (API Only)
========================= */

app.use("/api", (req: Request, res: Response) => {
  res.status(404).json({
    error: "API Route not found",
    path: req.originalUrl
  });
});

/* =========================
   Catch-all Route (SPA Support)
========================= */

// All other GET requests not handled before will return our React app
app.get("(.*)", (req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      // If index.html is missing (e.g. no build), fall back to 404 JSON
      res.status(404).json({
        error: "Client build not found. Please run 'npm run build' in the client directory.",
        path: req.originalUrl
      });
    }
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
   Start Server (FIXED)
========================= */

const startServer = async () => {
  try {
    await connectDB();
    await initSchema();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
};

startServer();
