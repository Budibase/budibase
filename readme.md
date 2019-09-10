## Getting Started for Contributors

Install requires [node-gyp](https://github.com/nodejs/node-gyp), due to a dependancy on [argon2](https://github.com/ranisalt/node-argon2)

### 1.  Prerequisites

*nodegyp - Windows  -* `npm install --global --production windows-build-tools`
if you have problems, this might help: https://github.com/nodejs/node-gyp/issues/1278

*nodegyp - Ubuntu (same for Mac ?)* `sudo apt-get install build-essentials`

*yarn -* `npm install -g yarn`

*lerna -* `npm install -g lerna`

*jest* - `npm install -g jest`

### 2. Clone this repository

`git clone git@github.com:Budibase/budibase.git`

then `cd ` into your local copy...

### 3.  Install and Build

`lerna bootstrap` will install all modules

`lerna run build` will build all pakcages

`lerna run initialise` will initialise your budibase (i.e. create local database)

### 3. Running

`lerna run dev:builder` - will run up the builder and server together - i.e. when you want to do some work on the builder

## Documentation

A work in progress, lives here: https://docs.budibase.com




