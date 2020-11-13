import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import builtins from "rollup-plugin-node-builtins"
import nodeglobals from "rollup-plugin-node-globals"
import svelte from "rollup-plugin-svelte"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/budibase-component-sdk.js",
      format: "esm",
      sourcemap: true,
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
    nodeglobals(),
  ],
  watch: {
    clearScreen: false,
  },
}
