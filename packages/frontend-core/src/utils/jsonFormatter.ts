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
  jsonString = jsonString
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
  return jsonString.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g,
    (match: string) => {
      let color = colors.numberColor
      let style = ""
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = colors.keyColor
        } else {
          color = colors.stringColor
          match = '"' + escapeHtml(match.substr(1, match.length - 2)) + '"'
          style = "word-wrap:break-word;white-space:pre-wrap;"
        }
      } else {
        color = /true/.test(match)
          ? colors.trueColor
          : /false/.test(match)
          ? colors.falseColor
          : /null/.test(match)
          ? colors.nullColor
          : color
      }
      return `<span style="${style}color:${color}">${match}</span>`
    }
  )
}
