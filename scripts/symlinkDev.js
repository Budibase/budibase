#!/usr/bin/env node

/** 
  This script symlinks the budibase component and client paths to the 
  ones that exist in your local development directories. This means you
  can work your budibase apps but also change code for the components
  and client library in real time.
*/

const fs = require("fs")
const { resolve } = require("path")

const devDir = "/tmp/.budibase/@budibase"

// create the dev directory if it doesn't exist
if (!fs.existsSync(devDir)) {
  fs.mkdirSync(devDir, { recursive: true })
}

const SYMLINK_PATHS = [
  {
    symlink: "/tmp/.budibase/@budibase/materialdesign-components",
    destination: resolve("packages/materialdesign-components"),
  },
  {
    symlink: "/tmp/.budibase/@budibase/standard-components",
    destination: resolve("packages/standard-components"),
  },
  {
    symlink: "/tmp/.budibase/budibase-client.esm.mjs",
    destination: resolve("packages/client/dist/budibase-client.esm.mjs"),
  },
  {
    symlink: "/tmp/.budibase/budibase-client.js",
    destination: resolve("packages/client/dist/budibase-client.js"),
  },
]

SYMLINK_PATHS.forEach(sym => {
  fs.symlinkSync(sym.destination, sym.symlink)
})

console.log("Dev Symlinks Created Successfully.")
