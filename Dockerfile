FROM node:20-alpine

LABEL authors="ygh3279799773"

WORKDIR /app

COPY . .

RUN npm install -g yarn
RUN yarn install

WORKDIR /app

EXPOSE 3003

CMD [ "node", "example1.js" ]
