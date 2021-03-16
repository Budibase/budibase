const { LITERAL_MARKER } = require("../helpers/constants")

const PostProcessorNames = {
  CONVERT_LITERALS: "convert-literals",
}

/* eslint-disable no-unused-vars */
class Postprocessor {
  constructor(name, fn) {
    this.name = name
    this.fn = fn
  }

  process(statement) {
    return this.fn(statement)
  }
}

module.exports.processors = [
  new Postprocessor(PostProcessorNames.CONVERT_LITERALS, statement => {
    if (!statement.includes(LITERAL_MARKER)) {
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
    }
    return value
  }),
]
