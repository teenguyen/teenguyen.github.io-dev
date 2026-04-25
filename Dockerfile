FROM node:20-alpine

WORKDIR /app

# Install dependencies with npm only (no yarn)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source after deps to keep layer caching efficient
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
