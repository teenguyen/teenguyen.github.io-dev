FROM node:20-alpine

WORKDIR /app

# Ship pnpm via Corepack (not in PATH on the base image until enabled).
RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev", "--", ".", "--webpack", "--hostname", "0.0.0.0"]
