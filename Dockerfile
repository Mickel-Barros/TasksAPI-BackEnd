FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/
COPY tsconfig.json ./
RUN npm ci 

COPY . .

RUN npm run prisma:generate || true
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
