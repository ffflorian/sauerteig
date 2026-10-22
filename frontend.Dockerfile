# Build
FROM node:26.12.1-alpine@sha256:40cd011b55415bc894e45b02fdd5a5dfde056921b7d23a64c74f80497af48797 AS builder

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
FROM nginx:1.31.8-alpine@sha256:e2d97c2b8c016f12c2f1a27d095685063b2f281c4edf2babfde6001cf4fb77a8

COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
