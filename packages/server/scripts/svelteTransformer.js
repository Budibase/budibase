const { compile } = require("svelte/compiler")
const { transformSync } = require("@babel/core")

module.exports = {
  process(sourceText) {
    const { js } = compile(sourceText, {
      css: "injected",
      generate: "server",
      runes: false,
      compatibility: {
        componentApi: 4,
      },
    })
    const { code } = transformSync(js.code, { babelrc: true })
    return { code: code }
  },
}
