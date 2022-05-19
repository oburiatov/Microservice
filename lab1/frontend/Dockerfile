FROM node:14.15-alpine as build
WORKDIR /app
COPY frontend/. ./
RUN npm install --force
EXPOSE 3001
CMD ["npm", "run", "start", "--port", "3001"]
