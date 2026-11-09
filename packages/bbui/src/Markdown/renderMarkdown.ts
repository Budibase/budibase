import { marked } from "marked"
import { sanitizeHtmlString } from "@budibase/shared-core"

export const renderMarkdown = (markdown: string | undefined) => {
  if (!markdown) {
    return ""
  }

  const html = marked.parse(markdown, { async: false })

  return sanitizeHtmlString(html)
}
