import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

const config = {
  preprocess: vitePreprocess({ script: true }),
  compilerOptions: {
    runes: false,
    compatibility: {
      componentApi: 4,
    },
  },
}

export default config
