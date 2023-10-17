import { last, flow } from "lodash/fp"

export const buildStyle = styles => {
  let str = ""
  for (let s in styles) {
    if (styles[s]) {
      let key = convertCamel(s)
      str += `${key}: ${styles[s]}; `
    }
  }
  return str
}

export const convertCamel = str => {
  return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
}

export const pipe = (arg, funcs) => flow(funcs)(arg)

export const capitalise = s => {
  if (!s) {
    return s
  }
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

export const lowercase = s => s.substring(0, 1).toLowerCase() + s.substring(1)

export const lowercaseExceptFirst = s =>
  s.charAt(0) + s.substring(1).toLowerCase()

export const get_name = s => (!s ? "" : last(s.split("/")))

export const get_capitalised_name = name => pipe(name, [get_name, capitalise])

export const isBuilderInputFocused = e => {
  const activeTag = document.activeElement?.tagName.toLowerCase()
  const inCodeEditor = document.activeElement?.classList?.contains("cm-content")
  if (
    (inCodeEditor || ["input", "textarea"].indexOf(activeTag) !== -1) &&
    e.key !== "Escape"
  ) {
    return true
  }
  return false
}
