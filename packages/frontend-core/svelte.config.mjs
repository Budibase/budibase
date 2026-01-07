import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

const config = {
  preprocess: vitePreprocess({ script: true }),
}

export default config
