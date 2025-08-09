#Generate build
FROM node:18-alpine as builder

WORKDIR /app/

COPY package*.json .
COPY yarn*.lock .

RUN yarn install

COPY . .
RUN yarn build 

#Deploy app
FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx","-g", "daemon off;"]

