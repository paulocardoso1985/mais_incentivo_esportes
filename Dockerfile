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

# Garante que a pasta public existe (evita erro no standalone/copy se estiver vazia no git)
RUN mkdir -p apps/web/public

# Gera o Prisma Client
RUN cd packages/database && npx prisma generate

# Build de tudo
RUN npx turbo run build

# ====================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Instalamos o prisma para rodar os comandos no start-combined.js
RUN npm install -g prisma

# 1. Copia arquivos base e node_modules (essencial para a API funcionar)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# 2. Copia API e Banco
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages/database ./packages/database

# 3. Copia Web (Next.js Standalone)
# O standalone ja contem um servidor node otimizado para produção.
# No monorepo ele gera a estrutura completa dentro de standalone/
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
# Copia public 
COPY --from=builder /app/apps/web/public ./apps/web/public

# 4. Script combinado
COPY start-combined.js ./

# Railway injeta a PORT automaticamente. 
# Removendo expooses fixas para evitar confusão no proxy.
CMD ["node", "start-combined.js"]
