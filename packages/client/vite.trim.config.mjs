import { defineConfig } from "vite"
import path from "path"
import fs from "fs"

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"

  // Get analysis from environment variables
  const usesCharts = process.env.BUDIBASE_INCLUDE_CHARTS !== "false"
  const usesForms = process.env.BUDIBASE_INCLUDE_FORMS !== "false"

  console.log({
    Charts: usesCharts,
    Forms: usesForms,
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
          // Externalize chart/form chunks we don't want to include
          if (!usesCharts && id.includes("charts-")) {
            return true
          }
          if (!usesForms && id.includes("forms-")) {
            return true
          }
          return false
        },
        output: {
          globals: id => {
            // Provide empty objects for externalized chunks
            if (id.includes("charts-")) return "{}"
            if (id.includes("forms-")) return "{}"
            return undefined
          },
        },
        treeshake: {
          moduleSideEffects: false,
        },
      },
    },
    plugins: [],
  }
})
