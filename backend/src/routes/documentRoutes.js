import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadDocument, listDocuments } from "../controllers/documentController.js";

const router = express.Router();

router.get("/", listDocuments);

router.post("/upload", upload.single("file"), uploadDocument);

export default router;
