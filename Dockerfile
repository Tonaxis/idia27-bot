# Étape 1 : Build du bot
FROM node:24-slim AS builder

WORKDIR /app
COPY . .

# Installer les dépendances et compiler le bot
RUN npm install && npm run build

# Étape 2 : Image finale
FROM node:24-slim

WORKDIR /app

# Copier uniquement les fichiers nécessaires
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/package-lock.json /app/
COPY --from=builder /app/.env /app/
COPY --from=builder /app/tdb-mini.config.json /app/

# Exécuter le bot Discord
# CMD ["sh", "-c", "NODE_TLS_REJECT_UNAUTHORIZED=0 node dist/index.js"]
CMD ["sh", "-c", "node dist/index.js"]
