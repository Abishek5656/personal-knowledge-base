import client from "../config/weaviate.js";
import { getEmbeddings } from "../utils/embeddingUtils.js";

export async function getRelevantChunks(question) {
  const queryVector = await getEmbeddings(question);

  const result = await client.graphql
    .get()
    .withClassName("DocumentChunk")
    .withFields("text source chunkIndex")
    .withNearVector({
      vector: queryVector,
    })
    .withLimit(3)
    .do();

  return result.data.Get.DocumentChunk || [];
}
