# Image de production de l'API CESIZen
FROM node:20-slim

WORKDIR /app

# Dépendances d'abord (cache Docker : ne se réinstalle que si package*.json change)
COPY package*.json ./
RUN npm ci --omit=dev

# Code source
COPY src ./src

# Sécurité : ne pas tourner en root dans le conteneur
USER node

EXPOSE 3001
CMD ["node", "src/server.js"]