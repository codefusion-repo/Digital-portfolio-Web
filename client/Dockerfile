# Dockerfile para el frontend
FROM node:18.17.0

ENV NODE_ENV=production

WORKDIR /client

COPY package*.json ./
RUN npm install -g npm@10.8.2
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]


