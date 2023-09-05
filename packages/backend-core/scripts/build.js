#!/usr/bin/node

const coreBuild = require("../../../scripts/build")

coreBuild("./src/plugin/index.ts", "./dist/plugins.js")
coreBuild("./src/index.ts", "./dist/index.js")

const glob = require("glob")
const inputFiles = [
  ...glob.sync("./src/**/*.[tj]s", { nodir: true }),
  ...glob.sync("./tests/**/*.[tj]s", { nodir: true }),
]

const path = require("path")
for (const file of inputFiles) {
  coreBuild(file, `./${path.join("dist", file.replace(/\.ts$/, ".js"))}`, {
    skipMeta: true,
    bundle: false,
    forcedFormat: "cjs",
    silent: true,
  })
}
