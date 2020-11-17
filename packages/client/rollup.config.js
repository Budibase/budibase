import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import builtins from "rollup-plugin-node-builtins"
import svelte from "rollup-plugin-svelte"
import path from "path"

const production = !process.env.ROLLUP_WATCH
const projectRootDir = path.resolve(__dirname)

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/budibase-client.js",
      format: "esm",
      sourcemap: "inline",
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
    svelte({
      dev: !production,
    }),
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
    commonjs(),
    builtins(),
  ],
  watch: {
    clearScreen: false,
  },
}
