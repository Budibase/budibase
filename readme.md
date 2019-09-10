## Getting Started for Contributors

Install requires [node-gyp](https://github.com/nodejs/node-gyp), due to a dependancy on [argon2](https://github.com/ranisalt/node-argon2)

### 1.  Prerequisites

*nodegyp - Windows  -* `npm install --global --production windows-build-tools`
if you have problems, this might help: https://github.com/nodejs/node-gyp/issues/1278

*nodegyp - Ubuntu (same for Mac ?)* `sudo apt-get install build-essentials`

*yarn -* `npm install -g yarn`

*lerna -* `npm install -g lerna`

*jest* - `npm install -g jest`

### 2.  Install and Build

`lerna bootstrap`

`lerna run build`

`yarn run initialise-server`



## Documentation

A work in progress, lives here: https://github.com/Budibase/docs




