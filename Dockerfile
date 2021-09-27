FROM nginx/unit:1.25.0-minimal

WORKDIR /application/jumpstart

# Copy NGINX config
COPY config.json /docker-entrypoint.d/config.json

# Copy web dir
COPY web/build /application/jumpstart/web

EXPOSE 8080