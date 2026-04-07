import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ferrariRouter from "./routes/ferrariRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/ferrari", ferrariRouter);

app.use(express.static(distPath));

app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
    return;
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: "Unable to load Ferrari data right now.",
    detail: error.message,
  });
});

export default app;
