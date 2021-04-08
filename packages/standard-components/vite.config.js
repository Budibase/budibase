import svelte from "@sveltejs/vite-plugin-svelte"
const path = require("path")

export default ({ mode }) => {
  const isProduction = mode === "production"
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.js"),
        name: "standard-components",
        formats: ["es"],
      },
      minify: isProduction,
    },
    plugins: [svelte()],
    resolve: {
      dedupe: ["svelte", "svelte/internal"],
    },
    rollupOptions: {
      external: ["svelte", "svelte/internal"],
    },
  }
}
