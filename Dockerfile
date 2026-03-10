# ====================================================
# Dockerfile Unificado (Single Block) para Railway
# ====================================================

FROM node:20-alpine AS builder
WORKDIR /app

# Instala turborepo global
RUN npm install -g turbo

# Copia arquivos de definição do workspace
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

# Instala dependências
RUN npm install

# Copia código fonte
COPY . .

# Gera o Prisma Client
RUN cd packages/database && npx prisma generate

# Build de tudo
RUN npx turbo run build

# ====================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copia arquivos base
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copia API
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Copia Banco/Prisma (necessário para db push no start)
COPY --from=builder /app/packages/database ./packages/database

# Web files (Next.js Standalone)
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
# Garantimos a existencia da pasta public (mesmo que vazia)
COPY --from=builder /app/apps/web/public* ./apps/web/public/

# Copia script combinado
COPY start-combined.js ./

# Variáveis de porta
ENV PORT=3000
EXPOSE 3000 3001

CMD ["node", "start-combined.js"]
