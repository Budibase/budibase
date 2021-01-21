import commonjs from "rollup-plugin-commonjs"
import globals from "rollup-plugin-node-globals"
import builtins from "rollup-plugin-node-builtins"
import polyfills from "rollup-plugin-node-polyfills"
import resolve from "rollup-plugin-node-resolve"
import json from "@rollup/plugin-json"

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "string-templates",
    exports: "named",
    globals: {
      fs: "fs",
    },
  },
  treeshake: true,
  external: ["fs"],
  plugins: [
    polyfills(),
    resolve({
      preferBuiltins: false
    }),
    commonjs(),
    globals(),
    builtins(),
    json(),
  ],
}
