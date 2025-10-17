import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

const config = {
  preprocess: vitePreprocess({ script: true }),
  compilerOptions: {
    runes: false,
    compatibility: {
      componentApi: 4,
    },
    hmr: true, // Explicitly enable HMR in Svelte 5 compiler
  },
}

export default config
