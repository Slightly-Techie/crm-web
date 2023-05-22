
FROM node:16-alpine

WORKDIR /app

COPY ./package*.json .

RUN npm i

ENV NODE_ENV=production \
    REACT_APP_API_URL=https://crm-api.fly.dev

COPY . .

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "8080"]