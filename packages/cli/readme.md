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

## Running the cli on dev

If you want to test this on dev, from the mono repo, run `npm link` from here first.

If you use VS Code, open it in this directory, and you will find launch configurations for each command - debugging, yay!