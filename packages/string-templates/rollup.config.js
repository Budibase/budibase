import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import json from "@rollup/plugin-json"
import typescript from "@rollup/plugin-typescript"
import polyfillNode from "rollup-plugin-polyfill-node"
import inject from "@rollup/plugin-inject"
import { terser } from "rollup-plugin-terser"

const production = !process.env.ROLLUP_WATCH

const config = (input, outputFile, format) => ({
  input,
  output: {
    sourcemap: !production,
    format,
    file: outputFile,
  },
  onwarn(warning, warn) {
    if (warning.code === "EVAL") {
      return
    }
    warn(warning)
  },
  plugins: [
    typescript({
      moduleResolution: "node",
    }),
    polyfillNode(),
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
    commonjs(),
    json(),
    inject({ Buffer: ["buffer", "Buffer"], process: "process/browser" }),
    production && terser(),
  ],
})

export default [
  config("src/index.ts", "./dist/bundle.cjs", "cjs"),
  config("src/index.ts", "./dist/bundle.mjs", "esm"),
]
