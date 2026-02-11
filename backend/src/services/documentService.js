import client from "../config/weaviate.js";

export async function getUploadedDocuments() {
  const result = await client.graphql
    .get()
    .withClassName("DocumentChunk")
    .withFields("source")
    .do();

  const items = result.data.Get.DocumentChunk || [];

  const uniqueDocs = [...new Set(items.map(i => i.source))];

  return uniqueDocs;
}
