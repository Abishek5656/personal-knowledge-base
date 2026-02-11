import express from "express";
import { systemStatus } from "../controllers/statusController.js";

const router = express.Router();

router.get("/", systemStatus);

export default router;
