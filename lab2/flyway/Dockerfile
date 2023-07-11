FROM flyway/flyway:8.5.9-alpine AS build
ENV TARGETPLATFORM=linux/amd64
ARG TARGETPLATFORM=linux/amd64
WORKDIR /flyway/sql
COPY lab2/migration/. .

ENTRYPOINT flyway -url=jdbc:postgresql://localhost:5432/directus -schemas=public -user=directus -password=directus -connectRetries=60 migrate