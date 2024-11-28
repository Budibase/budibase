import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import postcss from "postcss"
import path from "path"

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"
  return {
    build: {
      sourcemap: !isProduction,
      lib: {
        entry: "src/index.js",
        formats: ["es"],
        fileName: "bbui.es",
      },
    },
    plugins: [
      svelte({
        emitCss: true,
      }),
    ],
    css: {
      postcss,
    },
    resolve: {
      alias: {
        "@budibase/shared-core": path.resolve(__dirname, "../shared-core/src"),
        "@budibase/types": path.resolve(__dirname, "../types/src"),
      },
    },
  }
})
