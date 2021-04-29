import commonjs from "@rollup/plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser"
import builtins from "rollup-plugin-node-builtins"
import globals from "rollup-plugin-node-globals"

const production = !process.env.ROLLUP_WATCH

const plugins = [
  resolve({
    preferBuiltins: true,
    browser: true,
  }),
  commonjs(),
  globals(),
  builtins(),
  json(),
  production && terser(),
]

export default [
  {
    input: "src/index.mjs",
    output: {
      sourcemap: !production,
      format: "esm",
      file: "./dist/bundle.mjs",
    },
    plugins,
  },
  // This is the valid configuration for a CommonJS bundle, but since we have
  // no use for this, it's better to leave it out.
  // {
  //   input: "src/index.cjs",
  //   output: {
  //     sourcemap: !production,
  //     format: "cjs",
  //     file: "./dist/bundle.cjs",
  //     exports: "named",
  //   },
  //   plugins,
  // },
]
