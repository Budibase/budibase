import { LITERAL_MARKER } from "../helpers/constants"

export const PostProcessorNames = {
  CONVERT_LITERALS: "convert-literals",
}

/* eslint-disable no-unused-vars */
class Postprocessor {
  name
  private fn

  constructor(name, fn) {
    this.name = name
    this.fn = fn
  }

  process(statement) {
    return this.fn(statement)
  }
}

export const processors = [
  new Postprocessor(PostProcessorNames.CONVERT_LITERALS, statement => {
    if (typeof statement !== "string" || !statement.includes(LITERAL_MARKER)) {
      return statement
    }
    const splitMarkerIndex = statement.indexOf("-")
    const type = statement.substring(12, splitMarkerIndex)
    const value = statement.substring(
      splitMarkerIndex + 1,
      statement.length - 2
    )
    switch (type) {
      case "string":
        return value
      case "number":
        return parseFloat(value)
      case "boolean":
        return value === "true"
      case "object":
        return JSON.parse(value)
      case "js_result":
        // We use the literal helper to process the result of JS expressions
        // as we want to be able to return any types.
        // We wrap the value in an abject to be able to use undefined properly.
        return JSON.parse(value).data
    }
    return value
  }),
]
