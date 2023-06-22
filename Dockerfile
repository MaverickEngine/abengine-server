FROM node:17

WORKDIR /jedi
COPY package.json .
RUN yarn install
COPY . .
CMD yarn dev