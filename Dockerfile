# ===== Stage 1: Build Frontend =====
FROM node:20 AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
ENV VITE_API_URL=""
RUN npm run build


# ===== Stage 2: Backend + Serve Frontend =====
FROM node:20
WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --only=production

# Copy backend source
COPY backend/src ./src


# Copy frontend build output into backend/public
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose any port (Render overrides)
EXPOSE 10000

CMD ["npm", "start"]
