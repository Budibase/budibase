const { vitePreprocess } = require("@sveltejs/vite-plugin-svelte")

const config = {
  preprocess: vitePreprocess({ script: true }),
  compilerOptions: {
    runes: false,
    compatibility: {
      componentApi: 4,
    },
  },
}

module.exports = config
