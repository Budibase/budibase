import { includes } from "lodash/fp"

export const getCouchDbView = (hierarchy, indexNode) => {
  const filter = codeAsFunction("filter", indexNode.filter)
  const map = codeAsFunction("map", indexNode.map)
  const allowedIdsFilter

  const includeDocs = !map

  const couchDbMap = ``

}

const codeAsFunction = (name, code) => {
  if ((code || "").trim().length === 0) return

  let safeCode

  if (includes("return ")(code)) {
    safeCode = code
  } else {
    let trimmed = code.trim()
    trimmed = trimmed.endsWith(";")
      ? trimmed.substring(0, trimmed.length - 1)
      : trimmed
    safeCode = `return (${trimmed})`
  }

  return `function ${name}() {
  ${safeCode}  
  }`
}