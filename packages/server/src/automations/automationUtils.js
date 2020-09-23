const CouchDB = require("../db")

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

module.exports.cleanUpRecord = async (instanceId, modelId, record) => {
  const db = new CouchDB(instanceId)
  const model = await db.get(modelId)

  return module.exports.cleanInputValues(record, { properties: model.schema })
}

module.exports.cleanUpRecordById = async (instanceId, recordId, record) => {
  const db = new CouchDB(instanceId)
  const foundRecord = await db.get(recordId)
  return module.exports.cleanUpRecord(instanceId, foundRecord.modelId, record)
}
