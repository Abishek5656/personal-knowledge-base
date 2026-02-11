import { getRelevantChunks } from "../services/retrievalService.js";
import { callLLM } from "../services/llmService.js";

export async function askQuestion(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // 1. Get top 3 chunks from Weaviate
    const chunks = await getRelevantChunks(question);

    if (!chunks.length) {
      return res.json({
        answer: "No relevant information found.",
        sources: [],
      });
    }

    // 2. Build context for LLM
    const context = chunks
      .map((c, i) => `Source ${i + 1}: ${c.text}`)
      .join("\n\n");

    const prompt = `
      Use ONLY the following context to answer the question.
      If answer is not in context, say "I don't know".

      CONTEXT:
      ${context}

      QUESTION:
      ${question}
    `;

    // 3. Call LLM
    const answer = await callLLM(prompt);

    // 4. Return answer + sources
    res.json({
      answer,
      sources: chunks.map((c) => ({
        text: c.text,
        source: c.source,
        chunkIndex: c.chunkIndex,
      })),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error answering question",
      error: err.message,
    });
  }
}
