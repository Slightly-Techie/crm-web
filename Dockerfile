FROM node:16-alpine

WORKDIR /app

COPY ./package*.json .

RUN yarn install

ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=https://crm-api.fly.dev \ 
    NEXTAUTH_URL=http://localhost:3000 \ 
    NEXTAUTH_SECRET=yfYO7uOqGBEO6a871cgNuKwuqjbFe9lc859HMS6Z

COPY . .

RUN yarn build

CMD ["yarn", "start"]