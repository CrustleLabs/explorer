# Build stage
FROM node:22-alpine AS builder

# Install pnpm and git
RUN apk add --no-cache git && \
    corepack enable && corepack prepare pnpm@10.10.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Configure git to use HTTPS with token for private repos (set at build time)
ARG GITHUB_TOKEN
RUN if [ -n "$GITHUB_TOKEN" ]; then \
    git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "git@github.com:" && \
    git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"; \
    fi

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN pnpm run build

# Production stage - use serve to host static files
FROM node:22-alpine

RUN npm install -g serve

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 9000

CMD ["serve", "-s", "dist", "-l", "9000"]

