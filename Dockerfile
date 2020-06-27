FROM node:10-alpine
ENV NODE_ENV dev

RUN mkdir /winsotn-logger-elk
WORKDIR /winston-logger-elk

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

# RUN npm run build && npm prune --production

CMD ["npm", "start"]
