FROM node:14.15-alpine
ENV TARGETPLATFORM=linux/amd64
ARG TARGETPLATFORM=linux/amd64
WORKDIR /app
COPY lab1/frontend/. ./
RUN npm install --force
EXPOSE 3001
CMD ["npm", "run", "start", "--port", "3001"]
