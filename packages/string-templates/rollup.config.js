import commonjs from "@rollup/plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser"
import builtins from "rollup-plugin-node-builtins"
import globals from "rollup-plugin-node-globals"
import typescript from "@rollup/plugin-typescript"
import injectProcessEnv from "rollup-plugin-inject-process-env"
import inject from "@rollup/plugin-inject"

const production = !process.env.ROLLUP_WATCH

const config = (format, outputFile) => ({
  input: "src/index.ts",
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
    typescript(),
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
    commonjs(),
    globals(),
    inject({ Buffer: ["buffer", "Buffer"] }),
    builtins(),
    json(),
    injectProcessEnv({
      NO_JS: process.env.NO_JS,
    }),
    production && terser(),
  ],
})

export default [
  config("cjs", "./dist/bundle.cjs"),
  config("esm", "./dist/bundle.mjs"),
]
