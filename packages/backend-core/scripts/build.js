#!/usr/bin/node
const { join } = require("path")
const fs = require("fs")
const coreBuild = require("../../../scripts/build")

coreBuild("./src/plugin/index.ts", "./dist/plugins.js")
coreBuild("./src/index.ts", "./dist/index.js")
coreBuild("./tests/index.ts", "./dist/tests.js")
