FROM node:16-alpine

WORKDIR /app

COPY ./package*.json .

RUN yarn install

ENV NODE_ENV=production

COPY . .

RUN yarn build

CMD ["yarn", "start"]