FROM node:lts as build
WORKDIR /app
COPY ./package*.json ./
COPY ./yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# stage: 2 — the production environment
FROM nginx:alpine
RUN apk add certbot certbot-nginx
RUN mkdir /etc/letsencrypt
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
