import svelte from "rollup-plugin-svelte"
import postcss from "rollup-plugin-postcss"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"

const postcssOptions = () => ({
  extensions: [".scss", ".sass"],
  extract: false,
  minimize: true,
  use: [
    [
      "sass",
      {
        includePaths: ["./node_modules"],
      },
    ],
  ],
})

const coreExternal = ["shortid"]

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
    svelte({
      hydratable: true,
    }),
    resolve({
      preferBuiltins: true,
      browser: true,
      dedupe: importee => {
        return coreExternal.includes(importee)
      },
    }),
    commonjs({
      namedExports: {
        shortid: ["generate"],
      },
    }),
    postcss(postcssOptions()),
  ],
}
