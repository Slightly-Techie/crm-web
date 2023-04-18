


FROM node:16-alpine

WORKDIR /app

COPY . .

ENV NODE_ENV=production \
    REACT_APP_API_URL=https://crm-api.fly.dev

RUN npm i

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "8080"]