#!/usr/bin/env node

import { rmSync } from "fs"
import { build } from "vite"

const isWatch = process.argv.includes("--watch")
const isDev = process.argv.includes("--dev")

async function buildAll() {
  try {
    rmSync("dist", { recursive: true, force: true })
  } catch (e) {
    // Directory might not exist
  }

  const config = {
    build: {
      watch: isWatch ? {} : false,
    },
    mode: isDev ? "development" : "production",
  }

  console.log("Building new client...")
  process.env.BUNDLE_VERSION = "new"
  await build({
    ...config,
    build: {
      ...config.build,
      lib: {
        ...config.build.lib,
        fileName: () => "budibase-client.new.js",
      },
    },
    configFile: "./vite.config.mjs",
  })

  console.log("Building old client...")
  process.env.BUNDLE_VERSION = "old"
  await build({
    ...config,
    configFile: "./vite.config.mjs",
  })
}

buildAll().catch(err => {
  console.error(err)
  throw err
})
