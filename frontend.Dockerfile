# Build
FROM node:26.4.0-alpine@sha256:725aeba2364a9b16beae49e180d83bd597dbd0b15c47f1f28875c290bfd255b9 AS builder

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
FROM nginx:1.31.2-alpine@sha256:54f2a904c251d5a34adf545a72d32515a15e08418dae0266e23be2e18c66fefa

COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
