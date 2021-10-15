FROM node:16-slim AS build
WORKDIR web
COPY web/package.json web/package-lock.json ./
RUN npm install
COPY web/public/ ./public/
COPY web/src/ ./src/
RUN npm run build

FROM galenguyer/nginx:1.20.1 AS prod
WORKDIR /application/jumpstart/web
COPY config.json /docker-entrypoint.d/config.json
COPY --from=build /web/build /usr/share/nginx/html
# here be dragons
#EXPOSE 8080
#ENTRYPOINT ["npm install -g serve"]
