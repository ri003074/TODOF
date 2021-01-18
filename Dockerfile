FROM node:14.2.0-slim
WORKDIR /usr/src/app/
COPY ./todof/package.json /usr/src/app/
RUN npm install