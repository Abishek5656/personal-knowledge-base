# ===== Stage 1: Build Frontend =====
FROM node:20 AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
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

# Create uploads directory inside backend
RUN mkdir -p uploads && chmod -R 755 uploads

# OPTIONAL: if you want to copy existing local uploads
# COPY backend/uploads ./uploads

# Copy frontend build into backend/public
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 10000

CMD ["npm", "start"]
