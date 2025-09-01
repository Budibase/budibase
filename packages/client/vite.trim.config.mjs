import { defineConfig } from "vite"
import path from "path"
import fs from "fs"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"

  // Get analysis from environment variables
  const usesChartBlock = process.env.BUDIBASE_INCLUDE_CHARTBLOCK !== "false"

  console.log({
    ChartBlock: usesChartBlock,
  })

  // Find the compiled chunk files in dist/assets
  const assetsDir = path.resolve("dist/assets")
  const files = fs.readdirSync(assetsDir)

  const mainFile = files.find(
    file => file.startsWith("index-") && file.endsWith(".js")
  )

  if (!mainFile) {
    throw new Error(
      "No main JS file found in dist/assets. Run 'vite build' first."
    )
  }

  return {
    build: {
      lib: {
        entry: path.join(assetsDir, mainFile),
        formats: ["iife"],
        outDir: "dist",
        name: "budibase_client",
        fileName: () => "budibase-client.js",
      },
      emptyOutDir: false,
      minify: isProduction,
      rollupOptions: {
        external: id => {
          if (!usesChartBlock && id.includes("chartBlock-")) {
            return true
          }
          return false
        },
        output: {
          globals: id => {
            if (id.includes("chartBlock-")) return "{}"
            return undefined
          },
        },
        treeshake: {
          moduleSideEffects: false,
        },
      },
    },
    plugins: [
      visualizer({
        filename: "dist/budibase-trimmed-analysis.html",
        open: false,
      }),
    ],
  }
})
