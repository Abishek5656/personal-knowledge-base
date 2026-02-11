import { extractText } from "../utils/textExtractor.js";
import { chunkText } from "../services/chunkingService.js";
import { storeChunksInWeaviate } from "../services/vectorService.js";

export async function uploadDocument(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Extract text
    const text = await extractText(file.path);

    // 2. Chunk text
    const chunks = chunkText(text);

    // 3. Store in Weaviate
    await storeChunksInWeaviate(chunks, file.originalname);

    res.json({
      message: "File processed successfully",
      file: file.originalname,
      chunksStored: chunks.length,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error processing file",
      error: err.message,
    });
  }
}
