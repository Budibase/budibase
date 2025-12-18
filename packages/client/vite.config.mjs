import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"
import path from "path"
import { visualizer } from "rollup-plugin-visualizer"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

const ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
  "a11y-click-events-have-key-events",
  "element_invalid_self_closing_tag",
]

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"

  return {
    server: {
      open: false,
    },
    build: {
      lib: {
        entry: "src/index.ts",
        formats: ["es"],
        outDir: "dist",
        name: "budibase_client",
        fileName: () => "budibase-client.js",
      },
      emptyOutDir: true,
      minify: isProduction,
      rollupOptions: {
        output: {
          chunkFileNames: "chunks/[name]-[hash].js",
        },
        onwarn(warning, warn) {
          if (warning.code === "CYCLIC_CROSS_CHUNK_REEXPORT") {
            throw new Error(warning.message)
          }
          warn(warning) // keep the default behaviour for everything else
        },
      },
    },
    plugins: [
      svelte({
        emitCss: true,
        preprocess: vitePreprocess({ script: true }),
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
