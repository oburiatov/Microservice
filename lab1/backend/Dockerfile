FROM node:14.15-alpine
ENV TARGETARCH=linux-x64
WORKDIR /app
COPY . ./
RUN npm install --prefix server --force
EXPOSE 3000
CMD ["npm", "run", "start", "--prefix", "server"]
