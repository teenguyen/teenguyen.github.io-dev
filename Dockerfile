FROM node:20-alpine

WORKDIR /app

# Ship pnpm via Corepack (not in PATH on the base image until enabled).
RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml ./

# GitHub Packages (@teenguyen/*) needs auth. Pass a PAT via BuildKit secret (see docker-compose.yml).
# Do not use ARG for the token — it can leak into build cache / image metadata.
RUN --mount=type=secret,id=npm_token \
    sh -ec '\
      token=$(tr -d "\n\r" </run/secrets/npm_token); \
      if [ -z "$token" ]; then \
        echo "Missing build secret npm_token. Set NPM_TOKEN to a GitHub PAT with read:packages before docker compose build." >&2; \
        exit 1; \
      fi; \
      printf "%s\n" "@teenguyen:registry=https://npm.pkg.github.com" > /root/.npmrc; \
      printf "//npm.pkg.github.com/:_authToken=%s\n" "$token" >> /root/.npmrc; \
      pnpm install --frozen-lockfile; \
      rm -f /root/.npmrc'

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev", "--", ".", "--webpack", "--hostname", "0.0.0.0"]
