# Production image - serve pre-built static files
# Build on host first: pnpm install && pnpm run build
FROM node:22-alpine

RUN npm install -g serve

WORKDIR /app

# Copy pre-built assets (build on host first)
COPY dist ./dist

EXPOSE 9000

CMD ["serve", "-s", "dist", "-l", "9000"]

