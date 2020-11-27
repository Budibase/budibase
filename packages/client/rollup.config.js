import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import builtins from "rollup-plugin-node-builtins"
import svelte from "rollup-plugin-svelte"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "src/index.js",
  output: [
    {
      sourcemap: true,
      format: "esm",
      file: `./dist/budibase-client.js`,
    },
  ],
  plugins: [
    svelte({
      dev: !production,
    }),
    resolve({
      preferBuiltins: true,
      browser: true,
      dedupe: ["svelte", "svelte/internal"],
    }),
    commonjs(),
    builtins(),
  ],
  watch: {
    clearScreen: false,
  },
}
