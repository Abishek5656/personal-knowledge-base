# AI Implementation Notes

## AI Usage in this Project

This project leverages Artificial Intelligence for two main purposes:

1.  **Semantic Search (Embeddings)**:
    - Converting document text into vector embeddings to enable "meaning-based" search rather than just keyword matching.
    - Used during the document ingestion phase.

2.  **Generative Q&A (LLM)**:
    - Generating natural language answers based on the context retrieved from the vector database.
    - Used when a user asks a question in the chat interface.

## Technology Stack

### 1. Vector Database & Embeddings

- **Provider**: **Weaviate** (Free Instance)
- **Why**:
  - Weaviate offers a robust, cloud-managed free tier that is excellent for prototyping and personal projects.
  - It handles vector storage and retrieval efficiently with a simple API.
  - It supports hybrid search (keyword + vector), which improves retrieval accuracy.

### 2. Large Language Model (LLM)

- **Provider**: **Google Generative AI (Gemini/PaLM)**
- **Key**: `GOOGLE_API_KEY`
- **Why**:
  - **Cost**: Google offers a generous free tier for their Gemini/PaLM API series, making it highly accessible for personal developers.
  - **Performance**: Models like `gemini-pro` or `text-bison` provide high-quality reasoning and summarization capabilities suitable for RAG applications.
  - **Integration**: The `@google/genai` SDK is easy to integrate into Node.js environments.

_(Note: The project structure also contains references to OpenRouter, but the primary active implementation relies on Google's direct API integration.)_

## Manual Checks & Validation

During development, the following aspects were manually verified to ensure correctness:

1.  **Docker Build Process**:
    - Verified that the multi-stage Dockerfile correctly builds the frontend and copies the assets to the backend.
    - Confirmed that excluding `node_modules` via `.dockerignore` significantly reduced build times on Windows.

2.  **Environment Configuration**:
    - Checked that the `.env` variables are correctly loaded in both local dev mode and inside the Docker container.
    - Validated that the `VITE_API_URL` is correctly handled during the build process to avoid hardcoding localhost in production images.

3.  **API Endpoints**:
    - Manually tested the `/api/health` and other endpoints to ensure the backend is responsive.
    - Verified that the "Catch-All" route correctly serves the React frontend for non-API requests.

4.  **Route Handling**:
    - Fixed an issue with Express 5 route syntax (`path-to-regexp` error) by switching from string-based wildcards `*` to Regex `(.*)` or `/.*/`.
