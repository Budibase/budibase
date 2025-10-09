import { svelte } from "@sveltejs/vite-plugin-svelte"
import path from "path"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
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
  const bundleVersion = process.env.BUNDLE_VERSION || "esm"
  const isModuleBuild = bundleVersion === "esm"

  return {
    server: {
      open: false,
    },
    build: {
      lib: {
        entry: "src/index.ts",
        formats: isModuleBuild ? ["es"] : ["iife"],
        outDir: "dist",
        ...(isModuleBuild ? {} : { name: "budibase_client" }),
        fileName: () =>
          isModuleBuild ? "budibase-client.esm.js" : "budibase-client.js",
      },
      emptyOutDir: false,
      minify: isProduction,
      rollupOptions: {
        output: {
          inlineDynamicImports: !isModuleBuild,
          entryFileNames: chunkInfo => {
            if (isModuleBuild) {
              return chunkInfo.isEntry
                ? "budibase-client.esm.js"
                : "chunks/[name]-[hash].js"
            }
            return "budibase-client.js"
          },
          chunkFileNames: isModuleBuild ? "chunks/[name]-[hash].js" : undefined,
          assetFileNames: isModuleBuild
            ? assetInfo => {
                if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                  return "chunks/[name]-[hash][extname]"
                }
                return "assets/[name]-[hash][extname]"
              }
            : undefined,
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
        filename: `dist/budibase-client-analysis.${process.env.BUNDLE_VERSION}.html`,
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
