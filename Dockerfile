# Multi-Stage-Build für das Autogrowr-Frontend (Vite/React).
#
# Stage 1 baut die statischen Assets mit den VITE_*-Variablen, die als
# Docker-Build-Args übergeben werden (siehe docker-compose.yml im
# Backend-Repo, Service "autogrowr_frontend"). Vite übernimmt zur Build-Zeit
# gesetzte Prozess-Umgebungsvariablen automatisch in import.meta.env — eine
# .env-Datei ist für den Docker-Build nicht nötig.
#
# Stage 2 liefert nur das fertige dist/-Verzeichnis über eine schlanke
# nginx-Instanz aus (kein Node.js im Produktions-Image).

FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_MEDUSA_BACKEND_URL
ARG VITE_MEDUSA_PUBLISHABLE_KEY
ARG VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_MEDUSA_BACKEND_URL=$VITE_MEDUSA_BACKEND_URL \
    VITE_MEDUSA_PUBLISHABLE_KEY=$VITE_MEDUSA_PUBLISHABLE_KEY \
    VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
