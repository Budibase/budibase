import svelte from "@sveltejs/vite-plugin-svelte"

export default ({ mode }) => {
  const isProduction = mode === "production"
  return {
    build: {
      lib: {
        entry: "src/index.js",
        name: "bbui",
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
