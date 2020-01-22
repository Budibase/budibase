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

*jest* - `npm install -g jest`

### 2. Clone this repository

`git clone https://github.com/Budibase/budibase.git`

then `cd ` into your local copy...

### 3.  Install and Build

`yarn bootstrap` will install all modules

`yarn build` will build all packages

`yarn initialise` will initialise your budibase (i.e. create local database)

### 4. Running

A Budibase apps folder will have been created in `packages/server/myapps`. This is a blank apps folder, so you will need to create yourself an app:

```
cd packages/server
yarn run budi -- new your-app-name
```

then 

`yarn run budi` and to run the budibase server

if you then want to run the builder in dev mode (i.e. with hot reloading):

... keep the server running, and..
1. Open a new console
2. `cd packages/builder`
3. `yarn start`
4. Access the builder on http://localhost:3000

Notice that when inside `packages/server`, you can use any Budibase CLI command via yarn:

e.g. `yarn budi -- new mikes_app` == `budi new mikes_app`

This will use the CLI directly from `packages/cli`, rather than your globally installed `budi`

## Documentation

A work in progress, lives here: https://docs.budibase.com




