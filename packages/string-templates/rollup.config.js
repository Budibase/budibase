import commonjs from "rollup-plugin-commonjs"
import nodeResolve from "rollup-plugin-node-resolve"
import globals from "rollup-plugin-node-globals"
import builtins from "rollup-plugin-node-builtins"

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
  external: ["fs"],
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    globals(),
    builtins(),
  ],
}
