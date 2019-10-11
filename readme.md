## Getting Started for Contributors

Install requires [node-gyp](https://github.com/nodejs/node-gyp), due to a dependancy on [argon2](https://github.com/ranisalt/node-argon2)

### 1.  Prerequisites

*nodegyp -*
  - Windows  - https://github.com/nodejs/node-gyp#on-windows
  - Ubuntu `sudo apt-get install build-essentials`
  - Mac: https://github.com/nodejs/node-gyp#on-macos

*yarn -* `npm install -g yarn`

*lerna -* `npm install -g lerna`

*jest* - `npm install -g jest`

### 2. Clone this repository

`git clone git@github.com:Budibase/budibase.git`

then `cd ` into your local copy...

### 3.  Install and Build

`lerna bootstrap` will install all modules

`lerna run build` will build all packages

`lerna run initialise` will initialise your budibase (i.e. create local database)

### 4. Running

`lerna run dev:builder` - will run up the builder and server together - i.e. when you want to do some work on the builder

## Documentation

A work in progress, lives here: https://docs.budibase.com




