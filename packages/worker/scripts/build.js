#!/usr/bin/node
const coreBuild = require("../../../scripts/build")

const externals = ["deasync", "graphql/*"]

coreBuild("./src/index.ts", "./dist/index.js", { external: externals })
