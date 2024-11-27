const coreBuild = require("../../../scripts/build")
const {
  nodeModulesPolyfillPlugin,
} = require("esbuild-plugins-node-modules-polyfill")

const configs = [
  {
    input: "./src/index.ts",
    output: "./dist/index.js",
  },
  {
    input: "./src/iife.ts",
    output: "./dist/iife.js",
  },
]

for (const config of configs) {
  coreBuild(config.input, config.output, {
    platform: "neutral",
    plugins: [nodeModulesPolyfillPlugin({ modules: ["vm"] })],
  })
}
