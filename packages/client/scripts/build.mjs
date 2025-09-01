#!/usr/bin/env node

import { build, createServer } from "vite"

const isWatch = process.argv.includes("--watch")
const isDev = process.argv.includes("--dev")

async function buildAll() {
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
