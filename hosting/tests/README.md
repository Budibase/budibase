# Docker Image for Running Budibase Tests

## Overview
This image contains the basic setup for running 

## Usage

- Build the Image
- Run the Container


### Build the Image
The guidance below is based on building the Budibase single image on Debian 11 and AlmaLinux 8. If you use another distro or OS you will need to amend the commands to suit. 
#### Install Node
Budibase requires a more recent version of node (14+) than is available in the base Debian repos so:

```
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
apt install -y nodejs
node -v
```
Install yarn and lerna:
```
npm install -g yarn jest lerna
```
#### Install Docker

```
apt install -y docker.io
```

Check the versions of each installed version. This process was tested with the version numbers below so YMMV using anything else:

- Docker: 20.10.5
- node: 16.15.1
- yarn: 1.22.19
- lerna: 5.1.4

#### Get the Code
Clone the Budibase repo
```
git clone https://github.com/Budibase/budibase.git
cd budibase
```
#### Setup Node
Node setup:
```
node ./hosting/scripts/setup.js
yarn
yarn build
```
#### Build Image
The following yarn command does some prep and then runs the docker build command:
```
yarn build:docker:dependencies
```
