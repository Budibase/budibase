import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      entry: "src/dependencies/html5-qrcode.ts",
      formats: ["iife"],
      name: "Html5Qrcode",
      fileName: () => "html5-qrcode.js",
    },
    outDir: "dist/",
    emptyOutDir: false,
  },
})
