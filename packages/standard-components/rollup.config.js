import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import svelte from "rollup-plugin-svelte"
import postcss from "rollup-plugin-postcss"
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser"

import builtins from "rollup-plugin-node-builtins"

const production = !process.env.ROLLUP_WATCH
const externals = ["svelte", "svelte/internal"]

export default {
  external: externals,
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      sourcemap: false,
    },
  ],
  plugins: [
    builtins(),
    production && terser(),
    postcss(),
    svelte({
      dev: !production,
    }),
    resolve({
      browser: true,
      skip: externals,
    }),
    commonjs(),
    json(),
  ],
}
