import svelte from "rollup-plugin-svelte";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import path from "path";

const postcssOptions = () => ({
  extensions: [".scss", ".sass"],
  extract: false,
  minimize: true,
  use: [
    [
      "sass",
      {
        includePaths: ["./node_modules"]
      }
    ]
  ]
});

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      name: "budibaseStandardComponents",
      sourcemap: "inline"
    }
  ],
  plugins: [
    svelte({
      hydratable: true
    }),
    resolve(),
    postcss(postcssOptions())
  ]
};
