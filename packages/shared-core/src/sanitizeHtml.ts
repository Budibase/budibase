import sanitizeHtml from "sanitize-html"

const ALLOWED_TAGS = [
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
  "div",
  "span",
]

const ALLOWED_ATTRIBUTES = {
  "*": [
    "align",
    "bgcolor",
    "dir",
    "height",
    "lang",
    "role",
    "style",
    "valign",
    "width",
  ],
  a: ["href", "title"],
  img: ["alt", "src", "title"],
  li: ["value"],
  ol: ["reversed", "start", "type"],
  table: ["border", "cellpadding", "cellspacing"],
  td: ["colspan", "headers", "nowrap", "rowspan"],
  th: ["colspan", "headers", "nowrap", "rowspan", "scope"],
}

const SAFE_STYLE_VALUE =
  /^(?![\s\S]*(?:\\|\/\*|(?:expression|url)\s*\())[\s\S]*$/i
const ALLOWED_STYLE_PROPERTIES = [
  "background-color",
  "border",
  "border-bottom",
  "border-collapse",
  "border-color",
  "border-left",
  "border-right",
  "border-spacing",
  "border-style",
  "border-top",
  "border-width",
  "color",
  "display",
  "font",
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "height",
  "letter-spacing",
  "line-height",
  "margin",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "max-height",
  "max-width",
  "min-height",
  "min-width",
  "padding",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "text-align",
  "text-decoration",
  "vertical-align",
  "width",
]

const ALLOWED_STYLES = {
  "*": Object.fromEntries(
    ALLOWED_STYLE_PROPERTIES.map(property => [property, [SAFE_STYLE_VALUE]])
  ),
}

export const sanitizeHtmlString = (html: string | undefined): string => {
  if (!html) {
    return ""
  }

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedStyles: ALLOWED_STYLES,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
  })
}
