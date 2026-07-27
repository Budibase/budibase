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
  "dd-trace",
  "dd-trace/*",
  "bcrypt",
  "@datadog/*",
  "node-gyp-build",
  "node-gyp-build-optional-packages",
]

coreBuild("./src/index.ts", "./dist/index.js", { external: externals })
