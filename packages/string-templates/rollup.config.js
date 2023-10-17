import commonjs from "@rollup/plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser"
import builtins from "rollup-plugin-node-builtins"
import globals from "rollup-plugin-node-globals"
import injectProcessEnv from "rollup-plugin-inject-process-env"

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: "src/index.mjs",
    output: {
      sourcemap: !production,
      format: "esm",
      file: "./dist/bundle.mjs",
    },
    plugins: [
      resolve({
        preferBuiltins: true,
        browser: true,
      }),
      commonjs(),
      globals(),
      builtins(),
      json(),
      injectProcessEnv({
        NO_JS: process.env.NO_JS,
      }),
      production && terser(),
    ],
  },
]
