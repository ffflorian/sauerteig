# Build
FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS builder

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

# Keep only production dependencies for the runtime image
RUN yarn workspaces focus sauerteig-backend --production && yarn cache clean && mkdir -p packages/backend/node_modules

# Run
FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5

ARG VERSION
ARG COMMIT

ENV COMMIT=$COMMIT
ENV NODE_ENV=production
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV VERSION=$VERSION

WORKDIR /app

# Do not install yarn here: Alpine's yarn package pulls in Alpine's own nodejs
# hadolint ignore=DL3017
RUN apk upgrade --no-cache

COPY package.json ./
COPY packages/backend/package.json packages/backend/package.json
COPY packages/frontend/package.json packages/frontend/package.json
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/packages/backend/node_modules packages/backend/node_modules
COPY --from=builder /app/packages/backend/dist packages/backend/dist

EXPOSE 3000

CMD ["node", "packages/backend/dist/main.js"]
