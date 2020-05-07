import svelte from "rollup-plugin-svelte"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      name: "budibaseStandardComponents",
      sourcemap: "inline",
    },
  ],
  plugins: [
    svelte({
      hydratable: true,
    }),
    resolve({
      browser: true,
    }),
    commonjs()
  ],
}
