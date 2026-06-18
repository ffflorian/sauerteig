# Build
FROM node:26.3.1-alpine@sha256:a2dc166a387cc6ca1e62d0c8e265e49ca985d6e60abc9fe6e6c3d6ce8e63f606 AS builder

ENV NPM_CONFIG_UPDATE_NOTIFIER=false

WORKDIR /app

# hadolint ignore=DL3018
RUN apk add --no-cache yarn

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY packages/backend/package.json packages/backend/package.json
COPY packages/frontend/package.json packages/frontend/package.json

RUN yarn install --immutable && yarn cache clean

COPY packages/backend/ packages/backend/

RUN yarn workspace sauerteig-backend build

# Run
FROM node:26.3.1-alpine@sha256:a2dc166a387cc6ca1e62d0c8e265e49ca985d6e60abc9fe6e6c3d6ce8e63f606

ARG VERSION
ARG COMMIT

ENV COMMIT=$COMMIT
ENV NODE_ENV=production
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV VERSION=$VERSION

WORKDIR /app

# hadolint ignore=DL3018
RUN apk add --no-cache curl yarn

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY packages/backend/package.json packages/backend/package.json
COPY packages/frontend/package.json packages/frontend/package.json

RUN yarn workspaces focus sauerteig-backend --production && yarn cache clean

COPY --from=builder /app/packages/backend/dist packages/backend/dist

EXPOSE 3000

CMD ["node", "packages/backend/dist/main.js"]
