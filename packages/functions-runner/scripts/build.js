#!/usr/bin/node

const coreBuild = require("../../../scripts/build")

Promise.all([
  coreBuild("./src/index.ts", "./dist/index.js"),
  coreBuild("./src/start.ts", "./dist/start.js"),
]).catch(error => {
  console.error(error)
  process.exit(1)
})
