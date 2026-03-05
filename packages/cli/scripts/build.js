#!/usr/bin/node
const coreBuild = require("../../../scripts/build")

const externals = [
  "deasync",
  "graphql/*",
  "better-sqlite3",
  "sqlite3",
  "mysql",
  "pg",
  "pg-query-stream",
]

coreBuild("./src/index.ts", "./dist/index.js", { external: externals })
