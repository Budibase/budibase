#!/usr/bin/node

const coreBuild = require("../../../scripts/build")
const { build } = require("esbuild")

const bootstrapBuild = build({
  entryPoints: ["./src/isolate-bootstrap.js"],
  outfile: "./dist/isolate-bootstrap.js",
  bundle: true,
  format: "iife",
  platform: "neutral",
  target: "es2020",
  minify: Boolean(process.env.CI),
  sourcemap: true,
  sourcesContent: false,
})

Promise.all([
  coreBuild("./src/index.ts", "./dist/index.js"),
  coreBuild("./src/start.ts", "./dist/start.js"),
  coreBuild("./src/child.ts", "./dist/child.js"),
  bootstrapBuild,
]).catch(error => {
  console.error(error)
  process.exit(1)
})
