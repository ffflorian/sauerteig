# Build
FROM node:26.2.0-alpine@sha256:7c6af15abe4e3de859690e7db171d0d711bf37d27528eddfe625b2fe89e097f8 AS builder

ARG VERSION
ARG COMMIT
ARG VITE_BACKEND_URL
ARG VITE_VAPID_PUBLIC_KEY

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_COMMIT_ID=$COMMIT
ENV VITE_VERSION=$VERSION
ENV VITE_VAPID_PUBLIC_KEY=$VITE_VAPID_PUBLIC_KEY

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
FROM nginx:1.31.1-alpine@sha256:8b1e78743a03dbb2c95171cc58639fef29abc8816598e27fb910ed2e621e589a

COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
