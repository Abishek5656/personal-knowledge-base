# Architectural Thinking & Implementation Strategy

## 1. Core Architecture: Containerized Monolith

We have adopted a **Containerized Monolith** pattern for deployment, while maintaining a **Separation of Concerns** in the development structure.

### The Problem

- The project consists of a React frontend and a Node.js backend.
- Managing two separate deployment pipelines (one for static frontend hosting, one for backend API) adds complexity for personal projects.
- Cross-Origin Resource Sharing (CORS) configurations are necessary when frontend and backend live on different domains/ports.

### The Solution: Single Container Deployment

We treat the entire application as a single deployable unit. The backend API server takes on the additional responsibility of serving the compiled frontend static assets.

**Workflow:**

1.  **Development**: Frontend and Backend are developed independently in their respective directories (`/frontend`, `/backend`).
2.  **Build Process**: A multi-stage Docker build fuses them together.
    - **Stage 1 (Frontend Builder)**: Compiles the React application using Vite. The build artifacts (`/dist`) are produced here.
    - **Stage 2 (Runtime)**: Sets up the Node.js backend. The artifacts from Stage 1 are copied into the backend's `public` directory.
3.  **Runtime**: The Express server handles API requests at `/api/*` and serves the React frontend for all other routes (`*`).

### Benefits

- **Simplified Deployment**: Only one Docker container to build, push, and run.
- **Zero CORS Issues**: Since the frontend is served from the same origin as the API, browser CORS restrictions do not apply.
- **Atomic Updates**: Frontend and Backend versions are always synchronized in deployment.

## 2. Technology Stack Choices

### Frontend

- **React + Vite**: Chosen for high performance and modern development experience.
- **Material UI**: Used for rapid UI development with a professional look.

### Backend

- **Node.js + Express**: Lightweight and efficient for handling async I/O required for AI/RAG operations.
- **Vector Database (Weaviate)**: Used to store and retrieve document embeddings for the RAG pipeline.
- **LLM Integration**:
  - **OpenRouter**: Access to various LLM models.
  - **Google GenAI**: For embeddings and potentially alternative LLM responses.

## 3. Implementation Details

### Docker Multi-Stage Build

We use a multi-stage `Dockerfile` to keep the final image size small.

- The `frontend-builder` stage contains all the build tools (heavy).
- The final stage only contains the production dependencies and the compiled assets.

### Routing Strategy

The Express backend (`src/app.js`) implements a "Catch-All" route strategy:

1.  **API Routes**: `/api/*` requests are handled by specific routers.
2.  **Static Files**: Middleware serves files from the `public` directory.
3.  **SPA Fallback**: Any request not matching the above mocks the index.html, allowing React Router to handle client-side routing.

### Optimization for Windows/OneDrive

Since the development environment is on Windows with OneDrive sync:

- A comprehensive `.dockerignore` file is implemented to exclude `node_modules`. This prevents the Docker context from becoming massive and slow to upload, relying instead on clean `npm install` inside the container.
