import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
// import replace from "@rollup/plugin-replace"
import svelte from "rollup-plugin-svelte"
import postcss from "rollup-plugin-postcss"
import { terser } from "rollup-plugin-terser"

const production = !process.env.ROLLUP_WATCH
const externals = ["svelte", "svelte/internal"]

export default {
  external: externals,
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      name: "budibaseStandardComponents",
      sourcemap: false,
    },
  ],
  plugins: [
    production && terser(),
    postcss(),
    svelte({
      dev: !production,
    }),
    resolve({
      browser: true,
      skip: externals,
    }),
    commonjs(),
    // Fix for https://github.com/sveltejs/svelte/issues/3165
    // replace({
    //   "outros.c.push":
    //     "if (outros === undefined) { block.o(local); return }\noutros.c.push",
    // }),
  ],
}
