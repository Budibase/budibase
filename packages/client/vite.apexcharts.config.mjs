import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      entry: "src/apexcharts.ts",
      formats: ["iife"],
      name: "ApexCharts",
      fileName: () => "apexcharts.js",
    },
    outDir: "dist/dependencies/",
    emptyOutDir: false,
  },
})
