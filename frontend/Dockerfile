# ---- Stage 1: build ----
FROM node:20-alpine AS builder
WORKDIR /app

# Optional API URL build arg (app currently hardcodes http://localhost:3000)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies (lockfile present -> npm ci for reproducible builds)
COPY package*.json ./
RUN npm ci

# Copy sources and produce the production build -> /app/dist
COPY . .
RUN npm run build

# ---- Stage 2: serve with nginx ----
FROM nginx:alpine

# SPA-aware nginx config (client-side routing fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
