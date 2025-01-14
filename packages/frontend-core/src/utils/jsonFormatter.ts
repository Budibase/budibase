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

const entityMap: Record<string, string> = {
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
    return entityMap[s]
  })
}

export function format(json: string | object, colorOptions = {}) {
  const valueType = typeof json
  if (valueType !== "string") {
    json = JSON.stringify(json, null, 2) || valueType
  }
  let jsonString: string =
    valueType !== "string"
      ? JSON.stringify(json, null, 2) || valueType
      : (json as string)
  let colors = Object.assign({}, defaultColors, colorOptions)
  jsonString = jsonString
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
  return jsonString.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g,
    match => {
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
