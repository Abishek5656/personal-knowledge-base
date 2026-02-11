import client from "../config/weaviate.js";

export async function createSchema() {
  const schema = {
    class: "DocumentChunk",
    description: "Chunks of uploaded documents",
    vectorizer: "text2vec-huggingface",
    moduleConfig: {
      "text2vec-huggingface": {
        model: "sentence-transformers/all-MiniLM-L6-v2",
      },
    },
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
