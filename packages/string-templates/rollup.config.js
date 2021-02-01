import commonjs from "@rollup/plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import builtins from "rollup-plugin-node-builtins"
import globals from "rollup-plugin-node-globals"
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser"

const production = !process.env.ROLLUP_WATCH
export default {
  input: "src/esIndex.js",
  output: [
    {
      sourcemap: true,
      format: "esm",
      file: "./dist/bundle.js",
      name: "templates",
      exports: "named",
    },
  ],
  plugins: [
    resolve({
      mainFields: ["module", "main"],
      preferBuiltins: true,
      browser: true,
    }),
    commonjs(),
    globals(),
    builtins(),
    production && terser(),
    json(),
  ],
}
