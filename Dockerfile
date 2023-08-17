FROM node:16-alpine3.14 AS builder

WORKDIR /app

COPY ./package*.json .

RUN yarn install

COPY . .

RUN yarn build

FROM node:16-alpine3.14

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=https://crm-api.fly.dev

CMD ["yarn", "start"]
