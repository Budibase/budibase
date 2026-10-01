import hljs from "highlight.js/lib/core"
import jsonLanguage from "highlight.js/lib/languages/json"
import type { JSONValue } from "@budibase/types"

hljs.registerLanguage("json", jsonLanguage)

export const format = (json: JSONValue | undefined) => {
  const text =
    typeof json === "string"
      ? json
      : (JSON.stringify(json, null, 2) ?? typeof json)
  const highlighted = hljs.highlight(text, { language: "json" }).value
  return `<span class="json-highlight">${highlighted}</span>`
}
