# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.18.0 --activate

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

COPY . .
ARG PUBLIC_API_URL=http://localhost:3333/api/v1
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
RUN yarn build

FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=8 \
  CMD wget -qO- http://127.0.0.1/health || exit 1
