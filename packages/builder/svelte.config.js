const { vitePreprocess } = require("@sveltejs/vite-plugin-svelte")

console.log("DEAN Loading svelte.config.js in builder")

const config = {
  preprocess: vitePreprocess({ script: true }),
  compilerOptions: {
    runes: false,
    compatibility: {
      componentApi: 4,
    },
    hmr: true, // Explicitly enable HMR in Svelte 5 compiler
  },
  vitePlugin: {
    // HMR configuration for vite-plugin-svelte
    hot: {
      preserveLocalState: false, // Default behavior, can be set to true if needed
      injectCss: true, // Inject CSS updates without full reload
    },
  },
}

module.exports = config
