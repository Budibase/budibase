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
  // Always include blocks for now
  const usesBlocks = true

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
        external: id => {
          // Externalize modules we don't want to include
          if (
            !usesCharts &&
            (id.includes("/charts/") || id.endsWith("/charts"))
          ) {
            return true
          }
          if (!usesForms && (id.includes("/forms/") || id.endsWith("/forms"))) {
            return true
          }
          if (
            !usesBlocks &&
            (id.includes("/blocks/") || id.endsWith("/blocks"))
          ) {
            return true
          }
          return false
        },
        output: {
          globals: id => {
            // Provide empty globals for externalized modules
            if (id.includes("charts")) return "{}"
            if (id.includes("forms")) return "{}"
            if (id.includes("blocks")) return "{}"
            return undefined
          },
        },
      },
    },
    plugins: [
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
