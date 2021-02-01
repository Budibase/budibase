import commonjs from "@rollup/plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import builtins from "rollup-plugin-node-builtins"
import globals from "rollup-plugin-node-globals"
import json from "@rollup/plugin-json"
import replace from "@rollup/plugin-replace"
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
    // this replacement is a crazy hack to fix an issue that
    // rollup has with the handlebars-helper package
    // if we don't do this then the browser will always error
    // with the isNumber function being unavailable
    replace({
      include: [
        "node_modules/handlebars-helpers/lib/**",
        "node_modules/handlebar-utils/lib/**",
      ],
      "utils.isNumber(": "!isNaN(",
      "isNumber(": "!isNaN(",
    }),
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
