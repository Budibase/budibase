## Dev Environment on Windows 10/11 (WSL2)

### Install WSL with Ubuntu LTS

Enable WSL 2 on Windows 10/11 for docker support.

```
wsl --set-default-version 2
```

Install Ubuntu LTS.

```
wsl --install Ubuntu
```

Or follow the instruction here:
https://learn.microsoft.com/en-us/windows/wsl/install

### Install Docker in windows

Download the installer from docker and install it.

Check this url for more detailed instructions:
https://docs.docker.com/desktop/install/windows-install/

You should follow the next steps from within the Ubuntu terminal.

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

### Clone the repo

```
git clone https://github.com/Budibase/budibase.git
```

### Check Versions

This setup process was tested on Windows 11 with version numbers show below. Your mileage may vary using anything else.

- Docker: 20.10.7
- Docker-Compose: 2.10.2
- Node: v14.20.1
- Yarn: 1.22.19
- Lerna: 5.5.4

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

### Working with the code

Here are the instructions to work on the application from within Visual Studio Code (in Windows) through the WSL. All the commands and files are within the Ubuntu system and it should run as if you were working on a Linux machine.

https://code.visualstudio.com/docs/remote/wsl

Note you will be able to run the application from within the WSL terminal and you will be able to access the application from the a browser in Windows.
