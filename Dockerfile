# ====================================================
# Dockerfile Unificado para Railway (Monorepo)
# ====================================================

FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependências globais
RUN npm install -g turbo

# Copia arquivos de configuração do workspace
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

# Instala todas as dependências
RUN npm install

# Copia o código fonte
COPY . .

# Gera o Prisma Client
RUN cd packages/database && npx prisma generate

# Build de todas as aplicações usando Turbo
RUN npx turbo run build

# ====================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Instala o cliente Prisma para runtime (necessário para alguns comandos)
RUN npm install -g prisma

# Copia arquivos necessários do builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# API files
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Database files (Prisma migrations/schema)
COPY --from=builder /app/packages/database ./packages/database

# Web files (Next.js standalone)
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Router script
COPY start-router.js ./

# Railway usa a porta 3000 por padrão, mas o roteador gerencia isso
EXPOSE 3000 3001

CMD ["node", "start-router.js"]
