#!/usr/bin/env node

import { build } from "vite"

const isWatch = process.argv.includes("--watch")
const isDev = process.argv.includes("--dev")

async function buildAll() {
  const config = {
    build: {
      watch: isWatch ? {} : false,
    },
    mode: isDev ? "development" : "production",
  }

  console.log("Building new client...")
  process.env.BUNDLE_VERSION = "esm"
  await build({
    ...config,
    build: {
      ...config.build,
      lib: {
        ...config.build.lib,
        fileName: () => "budibase-client.esm.js",
      },
    },
    configFile: "./vite.config.mjs",
  })

  console.log("Building old client...")
  process.env.BUNDLE_VERSION = "iife"
  await build({
    ...config,
    configFile: "./vite.config.mjs",
  })
}

buildAll().catch(err => {
  console.error(err)
  throw err
})
