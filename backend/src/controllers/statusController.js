import client from "../config/weaviate.js";
import { callOpenRouter } from "../services/llmService.js";

export async function systemStatus(req, res) {
  try {
    // Check Weaviate connection
    let weaviateStatus = "OK";

    try {
      await client.misc.liveChecker().do();
    } catch {
      weaviateStatus = "DOWN";
    }

    // Check LLM connection
    let llmStatus = "OK";

    try {
      await callOpenRouter("ping");
    } catch {
      llmStatus = "DOWN";
    }

    res.json({
      backend: "OK",
      database: weaviateStatus,
      llm: llmStatus
    });

  } catch (err) {
    res.status(500).json({
      message: "Status check failed",
      error: err.message
    });
  }
}
