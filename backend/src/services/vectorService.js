import client from "../config/weaviate.js";

export async function storeChunksInWeaviate(chunks, fileName) {
  for (let i = 0; i < chunks.length; i++) {
    await client.data.creator()
      .withClassName("DocumentChunk")
      .withProperties({
        text: chunks[i],
        source: fileName,
        chunkIndex: i,
      })
      .do();
  }

  return true;
}
