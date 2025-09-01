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

  console.log("Building ApexCharts dependency...")
  await build({ configFile: "./vite.apexcharts.config.mjs" })

  if (isWatch) {
    console.log("Starting dev server...")
    await build({
      build: { watch: {} },
      mode: isDev ? "development" : "production",
    })
  } else {
    console.log("Building main client...")
    await build()

    console.log("Build complete!")
  }
}

buildAll().catch(console.error)
