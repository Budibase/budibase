import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import builtins from "rollup-plugin-node-builtins"
import globals from "rollup-plugin-node-globals"
import json from "@rollup/plugin-json"

export default {
  input: "src/index.js",
  output: [
    {
      sourcemap: true,
      format: "umd",
      file: "./dist/bundle.js",
      name: "string-templates",
      exports: "named",
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
    commonjs(),
    globals(),
    builtins(),
    json(),
  ],
}
