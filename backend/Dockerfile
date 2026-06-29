# ---- Stage 1: build ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (lockfile present -> npm ci for reproducible builds)
COPY package*.json ./
RUN npm ci

# Copy sources and compile TypeScript -> dist
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Stage 2: runtime ----
FROM node:20-alpine
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Generate Prisma Client for the runtime image
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

# Copy compiled output from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000
ENV PORT=3000

CMD ["node", "dist/server.js"]
