FROM node:14.15-alpine as build
ENV TARGETPLATFORM=linux/amd64
ARG TARGETPLATFORM=linux/amd64
WORKDIR /app
COPY lab1/frontend/. ./
RUN npm install --prefix client --force
RUN npm run build --prefix client

FROM nginx:stable-alpine
COPY --from=build /app/client/build /usr/share/nginx/html
COPY lab1/frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY lab1/frontend/nginx/cert/. /etc/nginx/certs/.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


