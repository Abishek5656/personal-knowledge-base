# ===== Stage 1: Build Frontend =====
FROM node:18 AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

ENV VITE_API_URL=""

RUN npm run build


# ===== Stage 1: Build Frontend =====
FROM node:20 AS frontend-builder
WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Make API calls relative to same domain
ENV VITE_API_URL=""

# Build the React/Vite frontend
RUN npm run build


# ===== Stage 2: Setup Backend and Serve Frontend =====
FROM node:20
WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --only=production

# Copy backend source code
COPY backend/src ./src

# Copy uploads folder
COPY backend/uploads ./uploads

# Copy environment variables
COPY backend/.env ./

# Copy built frontend files to backend public folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose application port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]

