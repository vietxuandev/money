# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy everything needed for build
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
COPY src ./src

# Install all dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Build using NestJS
RUN npm run build

# NestJS puts output in dist/src, copy the actual app files
# Create a clean dist directory with just what we need
RUN mkdir -p /app/dist-clean && \
    if [ -d dist/src ]; then \
      cp -r dist/src/* /app/dist-clean/; \
    else \
      cp -r dist/* /app/dist-clean/ 2>/dev/null || true; \
    fi && \
    rm -rf dist && \
    mv /app/dist-clean dist

# Verify main.js exists
RUN [ -f dist/main.js ] && echo "✓ Build successful: dist/main.js exists" || (echo "✗ ERROR: dist/main.js not found!" && ls -la dist/ && exit 1)

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm ci --only=production

# Generate Prisma Client
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Verify main.js exists
RUN [ -f dist/main.js ] && echo "✓ Production ready" || (echo "✗ ERROR: main.js missing!" && exit 1)

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 4000

CMD ["./docker-entrypoint.sh"]
