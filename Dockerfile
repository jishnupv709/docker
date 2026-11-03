FROM node:20-alpine AS angular-build
WORKDIR /ui
COPY angular-ui/package*.json ./
RUN npm install
COPY angular-ui/ ./
RUN npm run build

FROM node:20-alpine AS nest-build
WORKDIR /app
COPY nest-api/package*.json ./
RUN npm install
COPY nest-api/ ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=7860

COPY nest-api/package*.json ./
RUN npm ci --omit=dev

COPY --from=nest-build /app/dist ./dist
COPY --from=angular-build /ui/dist/angular-ui/browser ./public

EXPOSE 7860
CMD ["node", "dist/main.js"]