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

  console.log("Building ApexCharts dependency...")
  await build({
    ...config,
    configFile: "./vite.apexcharts.config.mjs",
  })

  console.log("Building client...")
  await build(config)
}

buildAll().catch(console.error)
