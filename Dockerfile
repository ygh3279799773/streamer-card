FROM node:20-alpine

LABEL authors="ygh3279799773"

RUN apk update && apk add chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY . .

RUN yarn install

WORKDIR /app

EXPOSE 3003

CMD [ "node", "src/index.ts" ]
