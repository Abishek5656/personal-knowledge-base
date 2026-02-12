import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import documentRoutes from "./routes/documentRoutes.js";
import qaRoutes from "./routes/qaRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";

dotenv.config();

// Fix __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/documents", documentRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/status", statusRoutes);

// Helper route for checking backend status
app.get("/api/health", (req, res) => {
  res.send("RAG Backend Running");
});

// Serve static files from the public directory (where frontend build will be)
// Note: In Docker, we'll copy frontend build to backend/public
app.use(express.static(path.join(__dirname, "../public")));

// Handle client-side routing, return all requests to index.html
// Serve static frontend
app.use(express.static(path.join(__dirname, "../public")));

// React SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

export default app;
