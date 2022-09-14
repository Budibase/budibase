import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import nodePolyfills from "rollup-plugin-polyfill-node"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "src/index.js",
  output: [
    {
      sourcemap: false,
      format: "esm",
      file: `./dist/sdk.mjs`,
    },
    {
      sourcemap: false,
      format: "cjs",
      file: `./dist/sdk.cjs`,
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
