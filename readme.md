# Getting Started with Budibase

(For contributors - scroll down)

### 1. Prerequisites (for nodegyp)

We will try to make this bit easier, but for now:

- Windows  - https://github.com/nodejs/node-gyp#on-windows
- Ubuntu `sudo apt-get install build-essentials`
- Mac: https://github.com/nodejs/node-gyp#on-macos

### 2. Global install budibase

`npm install -g budibase`

### 3. Start using Budibase

Create a directory to store your Budibase apps

`mkdir my-budibase`

`cd my-budibase`

Initialise Budibase in current directory

`budi init`

Create a new Budibase app

`budi new my-app`

Run Budibase

`budi`

You can now access the Budibase builder on http://localhost:4001/_builder

Start building!

Once you have created your app, you need to create yourself an instance of your app (i.e. a database)

`budi instance my-app`

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




