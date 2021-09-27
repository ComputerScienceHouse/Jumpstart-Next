FROM nginx/unit:1.25.0-python3.9

WORKDIR /application/jumpstart

# Install python libs
COPY requirements.txt /application/jumpstart/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy python files
COPY main.py /application/jumpstart/python/main.py

# Copy NGINX config
COPY config.json /docker-entrypoint.d/config.json

# Copy web dir
COPY web/build /application/jumpstart/web

EXPOSE 8080