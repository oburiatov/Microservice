FROM --platform=linux/amd64 node:14.15-alpine as build
WORKDIR /app
COPY . ./
RUN npm install --prefix server --force
EXPOSE 3000
CMD ["npm", "run", "start", "--prefix", "server"]
