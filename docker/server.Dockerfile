FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json
RUN npm install

FROM deps AS build
COPY . .
RUN npm run build --workspace shared && npm run build --workspace server

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/prisma ./server/prisma
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/server/package.json ./server/package.json
EXPOSE 8080
CMD ["node", "server/dist/index.js"]
