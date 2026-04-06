###########
# Builder #
###########
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (prefers existing lockfile)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm install; \
  fi

# Copy the rest of the app and build
COPY . .
RUN npm run build

############
# Runtime  #
############
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Copy only what is needed to run the built Next.js app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]