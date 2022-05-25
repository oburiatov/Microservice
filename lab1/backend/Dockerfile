FROM node:14.15-alpine
ENV TARGETPLATFORM=linux/amd64
ARG TARGETPLATFORM=linux/amd64
WORKDIR /app
COPY lab1/backend/. ./
RUN npm install --prefix server --force
EXPOSE 30001
CMD ["npm", "run", "start", "--prefix", "server"]
