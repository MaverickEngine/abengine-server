FROM node:18

WORKDIR /opt/edji-frontend
COPY package.json .
RUN yarn install
COPY . .
ENV HOST=0.0.0.0
EXPOSE 8080
CMD yarn dev