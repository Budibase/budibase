const { compile } = require('svelte/compiler')
const { transformSync } = require("@babel/core");

module.exports = {
  process(sourceText, sourcePath, options) {
    const { js } = compile(sourceText, { css: "injected", generate: "ssr" });
    const { code} = transformSync(js.code, { babelrc: true })

    return { code: code }
  }
}
