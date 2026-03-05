#!/usr/bin/node
const coreBuild = require("../../../scripts/build")

coreBuild("./src/plugin/index.ts", "./dist/plugins.js")
coreBuild("./src/index.ts", "./dist/index.js")
