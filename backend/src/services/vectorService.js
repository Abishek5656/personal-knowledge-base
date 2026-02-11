import client from "../config/weaviate.js";
import { getEmbeddings } from "../utils/embeddingUtils.js";

export async function storeChunksInWeaviate(chunks, fileName) {
  for (let i = 0; i < chunks.length; i++) {
    const vector = await getEmbeddings(chunks[i]);

    await client.data
      .creator()
      .withClassName("DocumentChunk")
      .withProperties({
        text: chunks[i],
        source: fileName,
        chunkIndex: i,
      })
      .withVector(vector)
      .do();
  }

  return true;
}
