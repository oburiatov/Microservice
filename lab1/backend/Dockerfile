FROM node:14.15-alpine AS build
ENV TARGETPLATFORM=linux/amd64
ARG TARGETPLATFORM=linux/amd64
WORKDIR /app
COPY lab1/backend/asyncapi/. ./asyncapi/
COPY lab1/backend/server/. ./server/
RUN npm install --prefix server --force
RUN npm run build --prefix server

FROM nginx:stable-alpine
COPY --from=build /app/server/build /usr/share/nginx/html
COPY lab1/backend/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY lab1/backend/nginx/cert/. /etc/nginx/certs/.
EXPOSE 30001
CMD ["nginx", "-g", "daemon off;"]
