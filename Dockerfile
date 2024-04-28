
FROM node:18.17.0

WORKDIR /app

COPY ./exemples/server.js .
COPY ./exemples/package.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
