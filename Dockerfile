FROM node:21-alpine3.18 AS builder

WORKDIR /app

COPY ./package*.json .

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=https://crm-api.fly.dev

ENV NEXTAUTH_SECRET=D2cHrJszmk54PigHGOUn1TSOlcfXSxVny0JUFN0IVzE=

RUN yarn build

# Remove dev dependencies
RUN npm prune --production

FROM node:21-alpine3.18 

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=https://crm-api.fly.dev

ENV NEXTAUTH_SECRET=D2cHrJszmk54PigHGOUn1TSOlcfXSxVny0JUFN0IVzE=

# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
