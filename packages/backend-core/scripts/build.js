#!/usr/bin/node
const coreBuild = require("../../../scripts/build")

coreBuild("./src/plugin/index.ts", "./dist/plugins.js")
coreBuild("./src/index.ts", "./dist/index.js")

const esbuild = require("esbuild")
const glob = require("glob")

const inputFiles = glob.sync("./tests/**/*.[tj]s", { nodir: true })
const outputDir = "./dist/tests"

esbuild
  .build({
    entryPoints: inputFiles,
    outdir: outputDir,
  })
  .catch(() => process.exit(1))
