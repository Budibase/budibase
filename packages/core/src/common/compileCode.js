import { compileCode as cCode } from "@nx-js/compiler-util"
import { includes } from "lodash/fp"

export const compileCode = code => {
  let func
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

  try {
    func = cCode(safeCode)
  } catch (e) {
    e.message = `Error compiling code : ${code} : ${e.message}`
    throw e
  }

  return func
}
