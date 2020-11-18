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
      format: "iife",
      name: "app",
      file: `./dist/budibase-client.js`,
    },
    {
      file: "dist/budibase-client.esm.mjs",
      format: "esm",
      sourcemap: "inline",
    },
  ],
  plugins: [
    svelte({
      dev: !production,
    }),
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
    commonjs(),
    builtins(),
  ],
  watch: {
    clearScreen: false,
  },
}
