// @ts-ignore
// eslint-disable-next-line local-rules/no-budibase-imports
import { iifeWrapper } from "@budibase/string-templates/iife"

export default new Proxy(
  {},
  {
    get: function (_, name) {
      // Both snippetDefinitions and snippetCache are injected to the isolate
      // global scope before this bundle is loaded, so we can access it from
      // there.
      // See https://esbuild.github.io/content-types/#direct-eval for info on
      // why eval is being called this way.
      // Snippets are cached and reused once they have been evaluated.
      // @ts-expect-error snippetDefinitions and snippetCache are injected to the global scope
      // eslint-disable-next-line no-undef
      if (!(name in snippetCache)) {
        // @ts-expect-error snippetDefinitions and snippetCache are injected to the global scope
        // eslint-disable-next-line no-undef
        snippetCache[name] = [eval][0](iifeWrapper(snippetDefinitions[name]))
      }
      // @ts-expect-error snippetDefinitions and snippetCache are injected to the global scope
      // eslint-disable-next-line no-undef
      return snippetCache[name]
    },
  }
)
