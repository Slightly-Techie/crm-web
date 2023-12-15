FROM node:21-alpine3.18 AS builder

WORKDIR /app

COPY ./package*.json .

RUN yarn install

COPY . .

ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=https://crm-api.fly.dev

ENV NEXTAUTH_SECRET=D2cHrJszmk54PigHGOUn1TSOlcfXSxVny0JUFN0IVzE=

RUN yarn build

FROM node:21-alpine3.18

WORKDIR /app

COPY --from=builder /app .

CMD ["yarn", "start"]
