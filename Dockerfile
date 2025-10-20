FROM node:18-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    libssl1.1 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
COPY prisma ./prisma/
COPY tsconfig.json ./

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
