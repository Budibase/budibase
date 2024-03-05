// @ts-ignore
// eslint-disable-next-line local-rules/no-budibase-imports
import { iifeWrapper } from "@budibase/string-templates/iife"

export default new Proxy(
  {},
  {
    get: function (_, name) {
      // Get snippet definitions from global context, get the correct snippet
      // then eval the JS. This will error if the snippet doesn't exist, but
      // that's intended.
      // https://esbuild.github.io/content-types/#direct-eval for info on why
      // eval is being called this way.
      // @ts-ignore
      // eslint-disable-next-line no-undef
      const snippet = ($("snippets") || []).find(x => x.name === name)
      return [eval][0](iifeWrapper(snippet.code))
    },
  }
)
