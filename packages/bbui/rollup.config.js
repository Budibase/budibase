import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser"
import postcss from "rollup-plugin-postcss"

const makeConfig = ({ input, name }) => ({
  input,
  output: {
    sourcemap: true,
    format: "esm",
    file: `dist/${name}.es.js`,
  },
  plugins: [
    resolve(),
    commonjs(),
    svelte({
      emitCss: true,
    }),
    postcss(),
    terser(),
    json(),
  ],
})

export default [
  makeConfig({ input: "src/index.js", name: "bbui" }),
  makeConfig({ input: "src/Form/internal/index.js", name: "internal" }),
]
