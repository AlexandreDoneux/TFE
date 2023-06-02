FROM node:18.14-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

#CMD ["npm", "start"]