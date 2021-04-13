FROM node:12.20.1
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json","yarn.lock","./"]
RUN yarn install --production
COPY . .
CMD [ "node","./bin/www" ]