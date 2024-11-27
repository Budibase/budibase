import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import postcss from "postcss"

export default defineConfig({
  // https://vite.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies
  optimizeDeps: {
    include: ["shared-core"],
  },
  build: {
    sourcemap: true,
    lib: {
      entry: "src/index.js",
      formats: ["es"],
      fileName: "bbui.es",
    },
    commonjsOptions: {
      include: [/shared-core/, /node_modules/],
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
})
