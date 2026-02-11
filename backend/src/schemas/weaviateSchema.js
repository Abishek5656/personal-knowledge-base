import client from "../config/weaviate.js";

export async function createSchema() {
  const schema = {
    class: "DocumentChunk",
    description: "Chunks of uploaded documents",
    vectorizer: "none",
    properties: [
      {
        name: "text",
        dataType: ["text"],
      },
      {
        name: "source",
        dataType: ["string"],
      },
      {
        name: "chunkIndex",
        dataType: ["int"],
      },
    ],
  };

  try {
    await client.schema.classCreator().withClass(schema).do();
    console.log("Weaviate schema created");
  } catch (err) {
    console.log("Schema may already exist");
  }
}
