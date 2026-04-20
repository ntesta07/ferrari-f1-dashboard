/**
 * api/index.js — Vercel serverless entry point
 * Mounts only the API routes (no static serving — Vercel handles that).
 * MongoDB is optional: if MONGO_URI is set Vercel connects to Atlas,
 * otherwise the in-memory cache in ferrariService handles all requests.
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from '../server/config/database.js';
import ferrariRouter from '../server/routes/ferrariRoutes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Lazily connect to MongoDB once per cold start (no-op if MONGO_URI is absent)
let dbConnected = false;
app.use(async (_req, _res, next) => {
  if (!dbConnected) {
    try { await connectDatabase(); dbConnected = true; } catch (_) {}
  }
  next();
});

app.use('/api/ferrari', ferrariRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unable to load Ferrari data.', detail: err.message });
});

export default app;
