import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import svelte from "rollup-plugin-svelte"
import postcss from "rollup-plugin-postcss"
import { terser } from "rollup-plugin-terser"
import path from "path"

const production = !process.env.ROLLUP_WATCH
const projectRootDir = path.resolve(__dirname)

export default {
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
    postcss(),
    svelte({
      dev: !production,
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
    // Fix for https://github.com/sveltejs/svelte/issues/3165
    replace({
      "outros.c.push":
        "if (outros === undefined) { block.o(local); return }\noutros.c.push",
    }),
  ],
}
