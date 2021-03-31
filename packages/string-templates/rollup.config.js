import commonjs from "@rollup/plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser"
import polyfillNode from "rollup-plugin-polyfill-node"

const production = !process.env.ROLLUP_WATCH

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: true,
  }),
  commonjs(),
  polyfillNode(),
  production && terser(),
  json(),
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
