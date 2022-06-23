# Docker Single Image for Budibase

## Overview
As an alternative to running several docker containers via docker-compose, the files under ./hosting/single can be used to build a docker image containing all of the Budibase components (minio, couch, clouseau etc).
We call this the 'single image' container as the Dockerfile adds all the components to a single docker image.


## Usage

- Amend Environment Variables
- Build Requirements
- Build the Image
- Run the Container

### Amend Environment Variables

Edit the Dockerfile in this directory amending the environment variables to suit your usage. Pay particular attention to changing passwords. 
The CUSTOM_DOMAIN variable will be used to request a certificate from LetsEncrypt and if successful you can point traffic to port 443. If you choose to use the CUSTOM_DOMAIN variable ensure that the DNS for your custom domain points to the public IP address where you are running Budibase - otherwise the certificate issuance will fail.
If you have other arrangements for a proxy in front of the single image container you can omit the CUSTOM_DOMAIN environment variable and the request to LetsEncrypt will be skipped. You can then point traffic to port 80.

### Build Requirements
We would suggest building the image with 6GB of RAM and 20GB of free disk space for build artifacts. The resulting image size will use approx 2GB of disk space.

### Build the Image
The guidance below is based on building the Budibase single image on Debian 11. If you use another distro or OS you will need to amend the commands to suit. 
Install Node
Budibase requires a recent version of node (14+) than is in the base Debian repos so:

```
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
apt install -y nodejs
node -v
```
Install yarn and lerna:
```
npm install -g yarn jest lerna
```
Install Docker
```
apt install -y docker.io
apt install -y python3-pip
pip3 install docker-compose
```
Check the versions of each installed version. This process was tested with the version numbers below so YMMV using anything else:

- Docker: 20.10.5
- docker-compose: 1.29.2
- node: 16.15.1
- yarn: 1.22.19
- lerna: 5.1.4

Clone the Budibase repo
```
git clone https://github.com/Budibase/budibase.git
cd budibase
```
Node setup:
```
node ./hosting/scripts/setup.js
yarn
yarn bootstrap
yarn build
```

Build the image from the Dockerfile:

```
yarn build:docker:single
```
If the docker build step fails run that step again manually with:
```
docker build --no-cache -t budibase:latest -f ./hosting/single/Dockerfile .
```

### Run the Container
```
docker run -d -p 80:80 -p 443:443 --name budibase budibase:latest
```
Where:
- -d runs the container in detached mode
- -p forwards ports from your host to the ports inside the container. If you are already using port 80 on your host for something else you can try running with an alternative port e.g. `-p 8080:80`
- --name is the name for the container as shown in `docker ps` and can be used with other docker commands e.g. `docker restart budibase`

When the container runs you should be able to access the container over http at your host address e.g. http://1.2.3.4/ or using your custom domain e.g. https://my.custom.domain/

When the Budibase UI appears you will be prompted to create an account to get started.

### Check
There are many things that could go wrong so if your container is not building or running as expected please check the following before opening a support issue.
Verify the healthcheck status of the container:
```
docker ps
```
Check the container logs:
```
docker logs budibase
```


### Support
This single image build is still a work-in-progress so if you open an issue please provide the following information:
- The OS and OS version you are building on
- The versions you are using of docker, docker-compose, yarn, node, lerna
- For build errors please provide zipped output
- For container errors please provide zipped container logs
