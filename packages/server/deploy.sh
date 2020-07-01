docker build -t prod-budi-app-server .
docker tag prod-budi-app-server:latest 545012296077.dkr.ecr.eu-west-1.amazonaws.com/prod-budi-app-server:latest
docker push 545012296077.dkr.ecr.eu-west-1.amazonaws.com/prod-budi-app-server:latest 
