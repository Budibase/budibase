#!/usr/bin/env node

import { libDependencies } from "@budibase/types"
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
    build: { watch: isWatch ? {} : false },
    mode: isDev ? "development" : "production",
  }

  for (const dep of libDependencies) {
    console.log(`Building ${dep.sourceFile} dependency...`)
    await build({
      ...config,
      configFile: false,
      build: {
        lib: {
          entry: `./src/dependencies/${dep.sourceFile}`,
          formats: ["iife"],
          name: dep.windowObject,
          fileName: () => dep.outFile,
        },
        rollupOptions: {
          context: "window",
        },
        outDir: "dist/",
        emptyOutDir: false,
      },
    })
  }

  console.log("Building client...")
  await build({
    ...config,
    configFile: "./vite.config.mjs",
  })
}

buildAll().catch(console.error)
