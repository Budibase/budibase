## Dev Environment on Debian 11

### Install NVM & Node 14
NVM documentation: https://github.com/nvm-sh/nvm#installing-and-updating

Install NVM
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```
Install Node 14
```
nvm install 14
```

### Install npm requirements

```
npm install -g yarn jest lerna
```
### Install Docker and Docker Compose

```
apt install docker.io
pip3 install docker-compose
```
### Clone the repo
```
git clone https://github.com/Budibase/budibase.git
```

### Check Versions

This setup process was tested on Debian 11 (bullseye) with version numbers show below. Your mileage may vary using anything else.

- Docker: 20.10.5
- Docker-Compose: 1.29.2
- Node: v14.20.1
- Yarn: 1.22.19
- Lerna: 5.1.4

### Build

```
cd budibase
yarn setup
```
The yarn setup command runs several build steps i.e.
```
node ./hosting/scripts/setup.js && yarn && yarn bootstrap && yarn build && yarn dev
```
So this command will actually run the application in dev mode. It creates .env files under `./packages/server` and `./packages/worker` and runs docker containers for each service via docker-compose.

The dev version will be available on port 10000 i.e.

http://127.0.0.1:10000/builder/admin