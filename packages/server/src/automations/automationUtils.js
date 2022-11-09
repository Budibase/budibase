const {
  decodeJSBinding,
  isJSBinding,
  encodeJSBinding,
} = require("@budibase/string-templates")
const sdk = require("../sdk")

/**
 * When values are input to the system generally they will be of type string as this is required for template strings.
 * This can generate some odd scenarios as the Schema of the automation requires a number but the builder might supply
 * a string with template syntax to get the number from the rest of the context. To support this the server has to
 * make sure that the post template statement can be cast into the correct type, this function does this for numbers
 * and booleans.
 *
 * @param {object} inputs An object of inputs, please note this will not recurse down into any objects within, it simply
 * cleanses the top level inputs, however it can be used by recursively calling it deeper into the object structures if
 * the schema is known.
 * @param {object} schema The defined schema of the inputs, in the form of JSON schema. The schema definition of an
 * automation is the likely use case of this, however validate.js syntax can be converted closely enough to use this by
 * wrapping the schema properties in a top level "properties" object.
 * @returns {object} The inputs object which has had all the various types supported by this function converted to their
 * primitive types.
 */
exports.cleanInputValues = (inputs, schema) => {
  if (schema == null) {
    return inputs
  }
  for (let inputKey of Object.keys(inputs)) {
    let input = inputs[inputKey]
    if (typeof input !== "string") {
      continue
    }
    let propSchema = schema.properties[inputKey]
    if (!propSchema) {
      continue
    }
    if (propSchema.type === "boolean") {
      let lcInput = input.toLowerCase()
      if (lcInput === "true") {
        inputs[inputKey] = true
      }
      if (lcInput === "false") {
        inputs[inputKey] = false
      }
    }
    if (propSchema.type === "number") {
      let floatInput = parseFloat(input)
      if (!isNaN(floatInput)) {
        inputs[inputKey] = floatInput
      }
    }
  }
  return inputs
}

/**
 * Given a row input like a save or update row we need to clean the inputs against a schema that is not part of
 * the automation but is instead part of the Table/Table. This function will get the table schema and use it to instead
 * perform the cleanInputValues function on the input row.
 *
 * @param {string} tableId The ID of the Table/Table which the schema is to be retrieved for.
 * @param {object} row The input row structure which requires clean-up after having been through template statements.
 * @returns {Promise<Object>} The cleaned up rows object, will should now have all the required primitive types.
 */
exports.cleanUpRow = async (tableId, row) => {
  let table = await sdk.tables.getTable(tableId)
  return exports.cleanInputValues(row, { properties: table.schema })
}

exports.getError = err => {
  if (err == null) {
    return "No error provided."
  }
  if (
    typeof err === "object" &&
    (err.toString == null || err.toString() === "[object Object]")
  ) {
    return JSON.stringify(err)
  }
  return typeof err !== "string" ? err.toString() : err
}

exports.substituteLoopStep = (hbsString, substitute) => {
  let checkForJS = isJSBinding(hbsString)
  let substitutedHbsString = ""
  let open = checkForJS ? `$("` : "{{"
  let closed = checkForJS ? `")` : "}}"
  if (checkForJS) {
    hbsString = decodeJSBinding(hbsString)
  }
  let pointer = 0,
    openPointer = 0,
    closedPointer = 0
  while (pointer < hbsString.length) {
    openPointer = hbsString.indexOf(open, pointer)
    closedPointer = hbsString.indexOf(closed, pointer) + 2
    if (openPointer < 0 || closedPointer < 0) {
      substitutedHbsString += hbsString.substring(pointer)
      break
    }
    let before = hbsString.substring(pointer, openPointer)
    let block = hbsString
      .substring(openPointer, closedPointer)
      .replace(/loop/, substitute)
    substitutedHbsString += before + block
    pointer = closedPointer
  }
  if (checkForJS) {
    substitutedHbsString = encodeJSBinding(substitutedHbsString)
  }
  return substitutedHbsString
}

exports.stringSplit = value => {
  if (value == null) {
    return []
  }
  if (value.split("\n").length > 1) {
    value = value.split("\n")
  } else {
    value = value.split(",")
  }
  return value
}
