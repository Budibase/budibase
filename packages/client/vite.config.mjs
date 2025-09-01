import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"
import path from "path"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import { visualizer } from "rollup-plugin-visualizer"

const ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
  "a11y-click-events-have-key-events",
]

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"

  return {
    server: {
      open: false,
    },
    build: {
      outDir: "dist",
      minify: false, // Don't minify
      rollupOptions: {
        input: "src/index.ts",
        treeshake: false, // Keep everything, don't tree shake
        output: {
          format: "es", // ES modules format
          manualChunks: {
            chartBlock: ["src/components/app/blocks/ChartBlock.svelte"],
            charts: ["src/components/app/charts/index.js"],
            forms: ["src/components/app/forms/index.ts"],
          },
        },
      },
    },
    plugins: [
      svelte({
        emitCss: true,
        onwarn: (warning, handler) => {
          // Ignore some warnings
          if (!ignoredWarnings.includes(warning.code)) {
            handler(warning)
          }
        },
      }),
      cssInjectedByJsPlugin(),
      visualizer({
        filename: "dist/budibase-client-analysis.html",
        open: false,
      }),
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
          replacement: path.resolve(__dirname, "src"),
        },
        {
          find: "leaflet/dist/leaflet.css",
          replacement: path.resolve(
            __dirname,
            "../../node_modules/leaflet/dist/leaflet.css"
          ),
        },
        {
          find: "leaflet",
          replacement: path.resolve(
            __dirname,
            "../../node_modules/leaflet/dist/leaflet.js"
          ),
        },
        {
          find: "html2canvas",
          replacement: path.resolve(
            __dirname,
            "../../node_modules/html2canvas/dist/html2canvas.min.js"
          ),
        },
      ],
    },
  }
})
