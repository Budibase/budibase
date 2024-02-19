#!/usr/bin/node

const { nodeBuiltIns } = require("esbuild-node-builtins")

const { join } = require("path")
const coreBuild = require("../../../scripts/build")

const dir = join(__dirname, "..")
const entryPath = join(dir, "src")
const outfilePath = join(dir, "dist")

coreBuild(join(entryPath, "index.mjs"), join(outfilePath, "bundle.mjs"), {
  tsconfig: "tsconfig.json",
  format: "esm",
  platform: "browser",
  plugins: [nodeBuiltIns()],
})
