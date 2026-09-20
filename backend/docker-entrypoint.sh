#!/bin/sh
set -eu

if [ "${RUN_MIGRATE:-true}" != "false" ]; then
  echo "Running database migrations..."
  node ace migration:run --force
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Seeding demo data..."
  node ace db:seed
fi

echo "Starting AdonisJS API on ${HOST:-0.0.0.0}:${PORT:-3333}..."
exec node bin/server.js
