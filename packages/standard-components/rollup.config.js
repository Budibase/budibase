import svelte from "rollup-plugin-svelte"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import postcss from "rollup-plugin-postcss"
import { terser } from "rollup-plugin-terser"

const production = !process.env.ROLLUP_WATCH
const lodash_fp_exports = ["isEmpty", "sortBy"]

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      name: "budibaseStandardComponents",
      sourcemap: true,
    },
  ],
  plugins: [
    // Only run terser in production environments
    production && terser(),
    postcss({
      plugins: [],
    }),
    svelte({
      hydratable: true,
    }),
    resolve({
      browser: true,
    }),
    commonjs({
      namedExports: {
        "lodash/fp": lodash_fp_exports,
      },
    }),
  ],
}
