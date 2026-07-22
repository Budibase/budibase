#!/usr/bin/node

const coreBuild = require("../../../scripts/build")

Promise.all([
  coreBuild("./src/index.ts", "./dist/index.js"),
  coreBuild("./src/start.ts", "./dist/start.js"),
  coreBuild("./src/child.ts", "./dist/child.js"),
]).catch(error => {
  console.error(error)
  process.exit(1)
})
