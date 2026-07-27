import { marked } from "marked"
import sanitizeHtml from "sanitize-html"

const MARKDOWN_TAGS = [
  "a",
  "blockquote",
  "br",
  "code",
  "del",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
]

export const renderMarkdown = (markdown: string | undefined) => {
  if (!markdown) {
    return ""
  }

  const html = marked.parse(markdown, { async: false })

  return sanitizeHtml(html, {
    allowedTags: MARKDOWN_TAGS,
    allowedAttributes: {
      a: ["href", "title"],
      img: ["alt", "src", "title"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
  })
}
