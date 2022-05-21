FROM node:14.15-alpine
ENV TARGETPLATFORM=linux/amd64
ARG TARGETPLATFORM=linux/amd64
WORKDIR /app
COPY lab1/backend/server/. ./
RUN npm install --prefix server --force
EXPOSE 3000
CMD ["npm", "run", "start", "--prefix", "server"]
