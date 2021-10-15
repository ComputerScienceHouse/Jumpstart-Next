FROM fedora AS build
WORKDIR web
RUN dnf install -y npm
COPY web/package.json web/package-lock.json ./
RUN npm install
COPY web/public/ ./public/
COPY web/src/ ./src/
RUN npm run build
RUN ls

FROM nginx:latest AS prod
WORKDIR /application/jumpstart/web
COPY config.json /docker-entrypoint.d/config.json
COPY --from=build /web/build /usr/share/nginx/html
# here be dragons
EXPOSE 8080
#ENTRYPOINT ["npm install -g serve"]
