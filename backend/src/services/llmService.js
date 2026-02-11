import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const googleGenAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function callLLM(prompt) {
  // Try a model from env first, otherwise use a safe default
  const envModel = process.env.GENAI_MODEL;
  // Default model: a broadly-available text generation model; change via GENAI_MODEL env var if you have preview access
  const defaultModel = "text-bison@001";
  const preferredModel = envModel || defaultModel;

  async function doGenerate(model) {
    // Keep payload simple and compatible with common examples
    return googleGenAI.models.generateContent({
      model,
      contents: prompt,
    });
  }

  try {
    let response;

    try {
      response = await doGenerate(preferredModel);
    } catch (err) {
      // If model not found, try to list available models and pick a supported one
      if (err?.status === 404) {
        try {
          // SDK returns a Pager when listing resources; iterate to collect models
          const pager = await googleGenAI.models.list();
          const availableModels = [];

          // Pager is async iterable
          for await (const m of pager) {
            availableModels.push(m);
          }

          // Some SDK versions expose the initial page as .models on the pager
          if (Array.isArray(pager?.models)) {
            for (const m of pager.models) {
              if (!availableModels.includes(m)) availableModels.push(m);
            }
          }

          const fallback =
            availableModels.find((m) =>
              (m.supportedMethods || []).includes("generateContent"),
            ) ||
            availableModels.find((m) =>
              /bison|gemini/i.test(m.name || m.id || m.displayName || ""),
            ) ||
            availableModels[0];

          const fallbackModel =
            fallback?.name ||
            fallback?.id ||
            fallback?.model ||
            fallback?.modelId ||
            fallback?.displayName;

          if (fallbackModel) {
            console.info(
              "Retrying generateContent with fallback model:",
              fallbackModel,
            );
            response = await doGenerate(fallbackModel);
          } else {
            throw err; // rethrow original
          }
        } catch (listErr) {
          console.error("List models / fallback retry failed:", listErr);
          console.error(
            "If you expected a preview model to be available, set the GENAI_MODEL env var to a supported model.",
          );
          // Propagate original error so caller sees the model-not-found status
          throw err;
        }
      } else {
        throw err;
      }
    }

    // Try to extract a plain text answer from common response shapes
    if (typeof response === "string") return response;

    // Newer GenAI SDKs often return an output array with content segments
    if (response?.output?.[0]?.content) {
      const parts = response.output[0].content
        .map((c) => c?.text || c?.message || (typeof c === "string" ? c : null))
        .filter(Boolean);
      if (parts.length) return parts.join("\n");
    }

    // Some responses include candidates
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts.map((p) => p.text).join("");
    }

    // As a last resort, return the JSON
    return JSON.stringify(response);
  } catch (e) {
    console.error("Google GenAI Error:", e);
    throw new Error(`Google GenAI failed: ${e.message}`);
  }
}
