import app from "./app.js";
import { createSchema } from "./schemas/weaviateSchema.js";

const PORT = process.env.PORT || 5000;

createSchema().then(() => {
  app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});
