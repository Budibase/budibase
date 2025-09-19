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
    build: {
      watch: isWatch ? {} : false,
    },
    mode: isDev ? "development" : "production",
  }

  for (const dep of Object.values(libDependencies)) {
    console.log(`Building ${dep.sourceFile} dependency...`)
    await build({
      ...config,
      configFile: false,
      build: {
        ...config.build,
        lib: {
          entry: `./src/dependencies/${dep.sourceFile}`,
          formats: ["iife"],
          name: dep.globalProperty,
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

  console.log("Building new client...")
  process.env.BUNDLE_VERSION = "new"
  await build({
    ...config,
    define: {
      ...config.define,
      __USE_DYNAMIC_LOADING__: true,
    },

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
    define: {
      ...config.define,
      __USE_DYNAMIC_LOADING__: false,
    },
    configFile: "./vite.config.mjs",
  })
}

buildAll().catch(err => {
  console.error(err)
  throw err
})
