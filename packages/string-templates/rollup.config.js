import commonjs from "@rollup/plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser"
import nodePolyfills from "rollup-plugin-polyfill-node"

const production = !process.env.ROLLUP_WATCH

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: true,
  }),
  commonjs(),
  nodePolyfills(),
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
  {
    input: "src/index.cjs",
    output: {
      sourcemap: !production,
      format: "cjs",
      file: "./dist/bundle.cjs",
      exports: "named",
    },
    plugins,
  },
]
