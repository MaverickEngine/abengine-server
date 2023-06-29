FROM node:17

WORKDIR /opt/edji-api
COPY package.json .
RUN yarn install
COPY . .
CMD yarn dev