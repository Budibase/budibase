// @ts-ignore
// eslint-disable-next-line local-rules/no-budibase-imports
import { iifeWrapper } from "@budibase/string-templates/iife"

export default new Proxy(
  {},
  {
    get: function (_, name) {
      // Get snippet definitions from global context, get the correct snippet
      // then eval the JS.
      // https://esbuild.github.io/content-types/#direct-eval for info on why
      // eval is being called this way.
      // @ts-ignore
      // eslint-disable-next-line no-undef
      return [eval][0](iifeWrapper($("snippets")[name]))
    },
  }
)
