# Multi-stage Dockerfile for Semgrep CLI Visualizer (Production SPA)
# Stage 1: Build static assets
FROM node:lts-alpine AS builder

WORKDIR /app

# Copy package manifests & install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve static bundle via Unprivileged Nginx (Hardened, Non-Root)
FROM nginxinc/nginx-unprivileged:alpine-slim

USER root

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production static build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure correct permissions for unprivileged user (UID 101)
RUN chown -R 101:101 /usr/share/nginx/html /etc/nginx/conf.d/default.conf

USER 101

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

