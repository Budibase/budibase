import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"
import path from "path"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ignoredWarnings = ["element_invalid_self_closing_tag"]

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"
  return {
    build: {
      sourcemap: !isProduction,
      lib: {
        entry: "src/index.ts",
        formats: ["es"],
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
    ],
    resolve: {
      alias: {
        "@budibase/shared-core": path.resolve(__dirname, "../shared-core/src"),
        "@budibase/types": path.resolve(__dirname, "../types/src"),
      },
    },
  }
})
