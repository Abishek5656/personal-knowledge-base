import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import documentRoutes from "./routes/documentRoutes.js";
import qaRoutes from "./routes/qaRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/documents", documentRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/status", statusRoutes);

app.get("/", (req, res) => {
  res.send("RAG Backend Running");
});

export default app;
