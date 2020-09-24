const CouchDB = require("../db")

/**
 * When running mustache statements to execute on the context of the automation it possible user's may input mustache
 * in a few different forms, some of which are invalid but are logically valid. An example of this would be the mustache
 * statement "{{steps[0].revision}}" here it is obvious the user is attempting to access an array or object using array
 * like operators. These are not supported by Mustache and therefore the statement will fail. This function will clean up
 * the mustache statement so it instead reads as "{{steps.0.revision}}" which is valid and will work. It may also be expanded
 * to include any other mustache statement cleanup that has been deemed necessary for the system.
 *
 * @param {string} string The string which *may* contain mustache statements, it is OK if it does not contain any.
 * @returns {string} The string that was input with cleaned up mustache statements as required.
 */
module.exports.cleanMustache = string => {
  let charToReplace = {
    "[": ".",
    "]": "",
  }
  let regex = new RegExp(/{{[^}}]*}}/g)
  let matches = string.match(regex)
  if (matches == null) {
    return string
  }
  for (let match of matches) {
    let baseIdx = string.indexOf(match)
    for (let key of Object.keys(charToReplace)) {
      let idxChar = match.indexOf(key)
      if (idxChar !== -1) {
        string =
          string.slice(baseIdx, baseIdx + idxChar) +
          charToReplace[key] +
          string.slice(baseIdx + idxChar + 1)
      }
    }
  }
  return string
}

/**
 * When values are input to the system generally they will be of type string as this is required for mustache. This can
 * generate some odd scenarios as the Schema of the automation requires a number but the builder might supply a string
 * with mustache syntax to get the number from the rest of the context. To support this the server has to make sure that
 * the post mustache statement can be cast into the correct type, this function does this for numbers and booleans.
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
module.exports.cleanInputValues = (inputs, schema) => {
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
 * Given a record input like a save or update record we need to clean the inputs against a schema that is not part of
 * the automation but is instead part of the Table/Model. This function will get the model schema and use it to instead
 * perform the cleanInputValues function on the input record.
 *
 * @param {string} instanceId The instance which the Table/Model is contained under.
 * @param {string} modelId The ID of the Table/Model which the schema is to be retrieved for.
 * @param {object} record The input record structure which requires clean-up after having been through mustache statements.
 * @returns {Promise<Object>} The cleaned up records object, will should now have all the required primitive types.
 */
module.exports.cleanUpRecord = async (instanceId, modelId, record) => {
  const db = new CouchDB(instanceId)
  const model = await db.get(modelId)

  return module.exports.cleanInputValues(record, { properties: model.schema })
}

/**
 * A utility function for the cleanUpRecord, which can be used if only the record ID is known (not the model ID) to clean
 * up a record after mustache statements have been replaced. This is specifically useful for the update record action.
 *
 * @param {string} instanceId The instance which the Table/Model is contained under.
 * @param {string} recordId The ID of the record from which the modelId will be extracted, to get the Table/Model schema.
 * @param {object} record The input record structure which requires clean-up after having been through mustache statements.
 * @returns {Promise<Object>} The cleaned up records object, which will now have all the required primitive types.
 */
module.exports.cleanUpRecordById = async (instanceId, recordId, record) => {
  const db = new CouchDB(instanceId)
  const foundRecord = await db.get(recordId)
  return module.exports.cleanUpRecord(instanceId, foundRecord.modelId, record)
}
