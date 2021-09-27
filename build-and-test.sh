cd web
npm run build
cd ..

docker build --tag jumpstart-nginx-docker .
docker run --net host --rm jumpstart-nginx-docker
docker rmi jumpstart-nginx-docker