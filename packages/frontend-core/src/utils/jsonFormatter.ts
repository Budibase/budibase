import { JSONValue } from "@budibase/types"

export type ColorsOptions = {
  keyColor?: string
  numberColor?: string
  stringColor?: string
  trueColor?: string
  falseColor?: string
  nullColor?: string
}

const defaultColors: ColorsOptions = {
  keyColor: "dimgray",
  numberColor: "lightskyblue",
  stringColor: "lightcoral",
  trueColor: "lightseagreen",
  falseColor: "#f66578",
  nullColor: "cornflowerblue",
}

const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#x60;",
  "=": "&#x3D;",
}

function escapeHtml(html: string) {
  return String(html).replace(/[&<>"'`=]/g, function (s) {
    return entityMap[s as keyof typeof entityMap]
  })
}

export function format(json: JSONValue, colorOptions: ColorsOptions = {}) {
  const valueType = typeof json
  let jsonString =
    typeof json === "string" ? json : JSON.stringify(json, null, 2) || valueType
  let colors = Object.assign({}, defaultColors, colorOptions)
  const tokenRegex =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g
  const formatToken = (token: string) => {
    let color = colors.numberColor
    let style = ""
    let formattedToken = token
    if (/^"/.test(token)) {
      color = /:$/.test(token) ? colors.keyColor : colors.stringColor
      formattedToken = escapeHtml(token)
      if (!/:$/.test(token)) {
        style = "word-wrap:break-word;white-space:pre-wrap;"
      }
    } else {
      color = /true/.test(token)
        ? colors.trueColor
        : /false/.test(token)
          ? colors.falseColor
          : /null/.test(token)
            ? colors.nullColor
            : color
      formattedToken = escapeHtml(token)
    }
    return `<span style="${style}color:${color}">${formattedToken}</span>`
  }

  let formatted = ""
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = tokenRegex.exec(jsonString)) !== null) {
    formatted += escapeHtml(jsonString.slice(lastIndex, match.index))
    formatted += formatToken(match[0])
    lastIndex = tokenRegex.lastIndex
  }

  return formatted + escapeHtml(jsonString.slice(lastIndex))
}
