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

    const components = statement.split("-")
    // pop and shift remove the empty array elements from the first and last dash
    components.pop()
    components.shift()
    const type = components[1]
    const value = components[2]
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
