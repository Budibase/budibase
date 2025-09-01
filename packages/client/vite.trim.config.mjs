import { defineConfig } from "vite"
import path from "path"
import fs from "fs"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"

  // Get analysis from environment variables
  const usesCharts = process.env.BUDIBASE_INCLUDE_CHARTS !== "false"

  console.log({
    Charts: usesCharts,
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
      minify: false,
      rollupOptions: {
        external: id => {
          if (!usesCharts && id.includes("charts-")) {
            return true
          }
          return false
        },
        output: {
          globals: id => {
            if (id.includes("chartBlock-")) {
              return `(function() {
                class SvelteComponent {
                  constructor(options) {
                    this.$$set = () => {};
                    this.$destroy = () => {};
                    this.$on = () => {};
                    this.$set = () => {};
                  }
                  $destroy() {}
                  $on() {}
                  $set() {}
                }
                
                class MockChartBlock extends SvelteComponent {
                  constructor(options) {
                    super(options);
                  }
                }
                
                // Export everything the chartBlock chunk would export
                return {
                  default: MockChartBlock,
                  SvelteComponent,
                  SvelteComponentDev: SvelteComponent,
                  HtmlTag: class HtmlTag {},
                  HtmlTagHydration: class HtmlTagHydration {},
                  SvelteElement: class SvelteElement extends HTMLElement {}
                };
              })()`
            }
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
