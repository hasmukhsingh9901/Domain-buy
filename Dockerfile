FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm run build


FROM node:lts-alpine AS builder

WORKDIR /app

COPY --from=builder /app/dist ./build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve","-s","build","-l","3000"]