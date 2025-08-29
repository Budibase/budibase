import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"
import path from "path"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

const ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
  "a11y-click-events-have-key-events",
]

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"

  // Get analysis from environment variables
  const usesCharts = process.env.BUDIBASE_INCLUDE_CHARTS !== "false"
  const usesForms = process.env.BUDIBASE_INCLUDE_FORMS !== "false"

  return {
    build: {
      lib: {
        entry: "src/index.ts",
        formats: ["iife"],
        outDir: "dist",
        name: "budibase_client",
        fileName: () => "budibase-client.js",
      },
      emptyOutDir: false,
      minify: isProduction,
      rollupOptions: {
        treeshake: {
          moduleSideEffects: false,
        },
      },
    },
    plugins: [
      // Plugin to conditionally exclude exports at build time
      {
        name: "conditional-exports",
        transform(code, id) {
          if (id.endsWith("src/components/app/index.js")) {
            let modifiedCode = code
            if (!usesCharts) {
              modifiedCode = modifiedCode.replace('export * from "./charts"', '// export * from "./charts" // excluded')
            }
            if (!usesForms) {
              modifiedCode = modifiedCode.replace('export * from "./forms"', '// export * from "./forms" // excluded')
            }
            return modifiedCode
          }
          return null
        },
      },
      svelte({
        emitCss: true,
        onwarn: (warning, handler) => {
          if (!ignoredWarnings.includes(warning.code)) {
            handler(warning)
          }
        },
      }),
      cssInjectedByJsPlugin(),
    ],
    resolve: {
      dedupe: ["svelte", "svelte/internal"],
      alias: [
        {
          find: "manifest.json",
          replacement: path.resolve("./manifest.json"),
        },
        {
          find: "@budibase/types",
          replacement: path.resolve("../types/src"),
        },
        {
          find: "@budibase/shared-core",
          replacement: path.resolve("../shared-core/src"),
        },
        {
          find: "@budibase/bbui",
          replacement: path.resolve("../bbui/src"),
        },
        {
          find: "@",
          replacement: path.resolve("src"),
        },
        {
          find: "leaflet/dist/leaflet.css",
          replacement: path.resolve(
            "../../node_modules/leaflet/dist/leaflet.css"
          ),
        },
        {
          find: "leaflet",
          replacement: path.resolve(
            "../../node_modules/leaflet/dist/leaflet.js"
          ),
        },
        {
          find: "html2canvas",
          replacement: path.resolve(
            "../../node_modules/html2canvas/dist/html2canvas.min.js"
          ),
        },
      ],
    },
  }
})
