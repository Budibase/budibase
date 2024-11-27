const coreBuild = require("../../../scripts/build")
const { polyfillNode } = require("esbuild-plugin-polyfill-node")

coreBuild("./src/index.ts", "./dist/index.js", {
  platform: "neutral",
  plugins: [polyfillNode()],
})
