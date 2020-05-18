#!/usr/bin/env node

/** 
  This script symlinks the budibase component and client paths to the 
  ones that exist in your local development directories. This means you
  can work your budibase apps but also change code for the components
  and client library in real time.
*/

const fs = require("fs")
const { resolve } = require("path")
const rimraf = require("rimraf")
const {
  budibaseTempDir,
} = require("../packages/server/src/utilities/budibaseDir")
const devDir = budibaseTempDir()

rimraf.sync(devDir)
fs.mkdirSync(`${devDir}/@budibase`, { recursive: true })

const SYMLINK_PATHS = [
  {
    symlink: `${devDir}/@budibase/materialdesign-components`,
    destination: resolve("packages/materialdesign-components"),
  },
  {
    symlink: `${devDir}/@budibase/standard-components`,
    destination: resolve("packages/standard-components"),
  },
  {
    symlink: `${devDir}/budibase-client.esm.mjs`,
    destination: resolve("packages/client/dist/budibase-client.esm.mjs"),
  },
  {
    symlink: `${devDir}/budibase-client.js`,
    destination: resolve("packages/client/dist/budibase-client.js"),
  },
]

SYMLINK_PATHS.forEach(sym => {
  fs.symlinkSync(sym.destination, sym.symlink)
})

console.log("Dev Symlinks Created Successfully.")
