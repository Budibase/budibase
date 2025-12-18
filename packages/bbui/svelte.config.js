const { vitePreprocess } = require("@sveltejs/vite-plugin-svelte")

const config = {
  preprocess: vitePreprocess(),
}

module.exports = config
