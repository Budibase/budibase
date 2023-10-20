## Dev Environment on MAC OSX 12 (Monterey)

### Install Homebrew

Install instructions [here](https://brew.sh/)

| **NOTE**: If you are working on a M1 Apple Silicon which is running Z shell, you could need to add
`eval $(/opt/homebrew/bin/brew shellenv)` line to your `.zshrc`. This will make your zsh to find the apps you install
through brew.

### Install Node

Budibase requires a recent version of node 14:

```
brew install node npm
node -v
```

### Install npm requirements

```
npm install -g yarn jest lerna
```

### Install Docker and Docker Compose

```
brew install docker docker-compose
```

### Clone the repo

```
git clone https://github.com/Budibase/budibase.git
```

### Check Versions

This setup process was tested on Mac OSX 12 (Monterey) with version numbers shown below. Your mileage may vary using anything else.

- Docker: 20.10.14
- Docker-Compose: 2.6.0
- Node: 14.20.1
- Yarn: 1.22.19
- Lerna: 5.1.4

### Build

```
cd budibase
yarn setup
```

The yarn setup command runs several build steps i.e.

```
node ./hosting/scripts/setup.js && yarn && yarn build && yarn dev
```

So this command will actually run the application in dev mode. It creates .env files under `./packages/server` and `./packages/worker` and runs docker containers for each service via docker-compose.

The dev version will be available on port 10000 i.e.

http://127.0.0.1:10000/builder/admin

| **NOTE**: If you are working on a M1 Apple Silicon, you will need to uncomment `# platform: linux/amd64` line in
[hosting/docker-compose-dev.yaml](../hosting/docker-compose.dev.yaml)

### Troubleshootings

#### Yarn setup errors

If there are errors with the `yarn setup` command, you can try installing nvm and node 14. This is the same as the instructions for Debian 11.

#### Node 14.20.1 not supported for arm64

If you are working with M1 or M2 Mac and trying the Node installation via `nvm`, probably you will find the error `curl: (22) The requested URL returned error: 404`.

Version `v14.20.1` is not supported for arm64; in order to use it, you can switch the CPU architecture for this by the following command:

```shell
arch -x86_64 zsh #Run this before nvm install
```
