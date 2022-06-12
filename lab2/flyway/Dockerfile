FROM flyway/flyway:8.5.9-alpine AS build
ENV TARGETPLATFORM=linux/amd64
ARG TARGETPLATFORM=linux/amd64
WORKDIR /flyway/sql
COPY lab2/migration/. .
#RUN npm install --prefix server --force
# CMD ["npm", "run", "start", "--prefix", "server"]

ENTRYPOINT flyway -url=jdbc:postgresql://localhost:5432/directus -schemas=public -user=directus -password=directus -connectRetries=60 migrate

# FROM nginx:stable-alpine
# # COPY --from=build /app/server/build /usr/share/nginx/html
# COPY lab1/backend/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# COPY lab1/backend/nginx/cert/. /etc/nginx/certs/.
# EXPOSE 30001
# CMD ["nginx", "-g", "daemon off;"]
