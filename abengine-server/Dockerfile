FROM node:17

WORKDIR /opt/abengine-server
COPY package.json .
RUN yarn install
COPY . .
CMD yarn dev