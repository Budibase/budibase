#!/usr/bin/env node

import { build } from "vite"
import { rmSync } from "fs"

const isWatch = process.argv.includes("--watch")
const isDev = process.argv.includes("--dev")

async function buildAll() {
  try {
    rmSync("dist", { recursive: true, force: true })
  } catch (e) {
    // Directory might not exist
  }

  const config = {
    build: { watch: isWatch ? {} : false },
    mode: isDev ? "development" : "production",
  }

  const dependencies = ["apexcharts", "html5-qrcode"]

  for (const dep of dependencies) {
    console.log(`Building ${dep} dependency...`)
    await build({
      ...config,
      configFile: `./vite.${dep}.config.mjs`,
    })
  }

  console.log("Building client...")
  await build({
    ...config,
    configFile: "./vite.config.mjs",
  })
}

buildAll().catch(console.error)
