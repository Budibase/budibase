#!/usr/bin/node
const coreBuild = require("../../../scripts/build")

const externals = [
  "deasync",
  "better-sqlite3",
  "mysql",
  "pg-query-stream",
  "sqlite3",
  "pg-native",
]

coreBuild("./src/index.ts", "./dist/index.js", { external: externals })
