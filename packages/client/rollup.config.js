import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import svelte from "rollup-plugin-svelte"
import { terser } from "rollup-plugin-terser"
import postcss from "rollup-plugin-postcss"
import svg from "rollup-plugin-svg"
import json from "rollup-plugin-json"
import builtins from "rollup-plugin-node-builtins"
import globals from "rollup-plugin-node-globals"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "src/index.js",
  output: [
    {
      sourcemap: false,
      format: "iife",
      file: `./dist/budibase-client.js`,
    },
  ],
  plugins: [
    svelte({
      emitCss: true,
    }),
    postcss(),
    commonjs(),
    globals(),
    builtins(),
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
    svg(),
    json(),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
