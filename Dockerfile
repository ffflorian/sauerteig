# Build
FROM node:26-alpine@sha256:e71ac5e964b9201072425d59d2e876359efa25dc96bb1768cb73295728d6e4ea AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml vite.config.ts tsconfig.json index.html ./
COPY src/ src/
COPY public/ public/
COPY .yarn/ .yarn/

RUN yarn install --immutable
RUN yarn build

# Serve
FROM nginx:1.31.0-alpine@sha256:c22e76a97fe5bacad9d58bad0a96e903480c05f8dee30884b14550530ddd25a9

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
