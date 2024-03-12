// @ts-ignore
// eslint-disable-next-line local-rules/no-budibase-imports
import { iifeWrapper } from "@budibase/string-templates/iife"

export default new Proxy(
  {},
  {
    get: function (_, name) {
      // Snippet definitions are injected to the isolate global scope before
      // this bundle is loaded, so we can access it from there.
      // https://esbuild.github.io/content-types/#direct-eval for info on why
      // eval is being called this way.
      // @ts-ignore
      // eslint-disable-next-line no-undef
      const snippet = (snippetDefinitions || []).find(x => x.name === name)
      return [eval][0](iifeWrapper(snippet.code))
    },
  }
)
