# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS base
WORKDIR /app
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Build-time env so `node ace build` can load Vine/Env validation.
# These are not runtime secrets.
ENV TZ=UTC \
    PORT=3333 \
    HOST=0.0.0.0 \
    LOG_LEVEL=error \
    APP_KEY=build-time-placeholder-change-me \
    APP_URL=http://localhost:3333 \
    SESSION_DRIVER=cookie \
    DB_HOST=127.0.0.1 \
    DB_PORT=5432 \
    DB_USER=todo \
    DB_PASSWORD=todo \
    DB_DATABASE=todo

FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --frozen-lockfile

FROM deps AS build
COPY . .
RUN node ace build --package-manager=yarn

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3333 \
    TZ=UTC

COPY --from=build /app/build ./
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN yarn install --frozen-lockfile --production \
    && chmod +x /app/docker-entrypoint.sh

EXPOSE 3333
HEALTHCHECK --interval=10s --timeout=5s --start-period=40s --retries=10 \
  CMD node -e "fetch('http://127.0.0.1:3333/').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/app/docker-entrypoint.sh"]
