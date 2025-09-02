import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import path from "path"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

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
