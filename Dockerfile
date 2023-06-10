FROM node:16-alpine

WORKDIR /app

COPY ./package*.json .

RUN yarn install

ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=https://crm-api.fly.dev

COPY . .

RUN yarn build

CMD ["yarn", "start"]