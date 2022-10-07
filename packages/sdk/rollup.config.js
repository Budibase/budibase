import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import nodePolyfills from "rollup-plugin-polyfill-node"

export default {
  input: "src/index.js",
  output: [
    {
      sourcemap: false,
      format: "esm",
      file: "./dist/sdk.mjs",
    },
  ],
  plugins: [
    commonjs(),
    nodePolyfills(),
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
  ],
}
