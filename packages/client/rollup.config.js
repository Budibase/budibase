import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import builtins from "rollup-plugin-node-builtins"
import nodeglobals from "rollup-plugin-node-globals"

export default {
  input: "src/index.js",
  output: [
    {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: `./dist/budibase-client.js`,
    },
    {
      file: "dist/budibase-client.esm.mjs",
      format: "esm",
      sourcemap: "inline",
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
    commonjs(),
    builtins(),
    nodeglobals(),
  ],
  watch: {
    clearScreen: false,
  },
}
