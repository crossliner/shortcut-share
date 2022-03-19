FROM node:alpine
WORKDIR /app
COPY . .
ENV NODE_ENV="production"
ENV PORT=8080
EXPOSE 8080
RUN yarn install

CMD [ "node", "src/index.js" ]