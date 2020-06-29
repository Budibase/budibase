docker build -t prod-apps-budi-live .
docker tag prod-apps-budi-live:latest 545012296077.dkr.ecr.eu-west-1.amazonaws.com/prod-apps-budi-live:latest
docker push 545012296077.dkr.ecr.eu-west-1.amazonaws.com/prod-apps-budi-live:latest 
