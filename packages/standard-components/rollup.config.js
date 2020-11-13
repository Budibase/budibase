import svelte from "rollup-plugin-svelte"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import postcss from "rollup-plugin-postcss"
import alias from "@rollup/plugin-alias"
import { terser } from "rollup-plugin-terser"
import path from "path"

const production = !process.env.ROLLUP_WATCH
const lodash_fp_exports = ["isEmpty"]
const projectRootDir = path.resolve(__dirname)

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
    alias({
      entries: [
        {
          find: "@budibase/component-sdk",
          replacement: path.resolve(
            projectRootDir,
            "../component-sdk/dist/budibase-component-sdk"
          ),
        },
      ],
    }),
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
