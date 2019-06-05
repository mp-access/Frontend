FROM node:10.15.3-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN yarn
COPY . ./
RUN yarn build

# stage: 2 — the production environment
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]