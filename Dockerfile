FROM node:14.2.0-slim
WORKDIR /app/
COPY package.json /app/
RUN npm install