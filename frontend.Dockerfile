# Build
FROM node:26.5.0-alpine@sha256:e88a35be04478413b7c71c455cd9865de9b9360e1f43456be5951032d7ac1a66 AS builder

ARG VERSION
ARG COMMIT

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV VITE_COMMIT_ID=$COMMIT
ENV VITE_VERSION=$VERSION

# VITE_BACKEND_URL and VITE_VAPID_PUBLIC_KEY are non-secret and committed in
# packages/frontend/.env.production. They are intentionally not passed as build
# args here: an empty build arg would override the .env.production value (Vite
# lets process.env take precedence), shipping an empty VAPID key and silently
# breaking push subscriptions.

WORKDIR /app

# hadolint ignore=DL3018
RUN apk add --no-cache yarn

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY packages/frontend/package.json packages/frontend/
COPY packages/backend/package.json packages/backend/

RUN yarn install --immutable && yarn cache clean

COPY packages/frontend/ packages/frontend/

RUN yarn workspace sauerteig-frontend build

# Serve
FROM nginx:1.31.3-alpine@sha256:2776cd5b70d8983e27e9f5c90abee3d24c690014ae8ecbb529572d954a459096

COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
