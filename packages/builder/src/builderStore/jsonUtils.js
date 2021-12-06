export const convertJSONSchemaToTableSchema = (
  jsonSchema,
  squashObjects = false
) => {
  if (!jsonSchema) {
    return null
  }
  if (jsonSchema.schema) {
    jsonSchema = jsonSchema.schema
  } else {
    jsonSchema = {
      value: jsonSchema,
    }
  }
  const keys = extractJSONSchemaKeys(jsonSchema, squashObjects)
  let schema = {}
  keys.forEach(({ key, type }) => {
    schema[key] = { type, name: key }
  })
  return schema
}

const extractJSONSchemaKeys = (jsonSchema, squashObjects = false) => {
  if (!jsonSchema || !Object.keys(jsonSchema).length) {
    return []
  }
  let keys = []
  Object.keys(jsonSchema).forEach(key => {
    const type = jsonSchema[key].type
    if (type === "json" && squashObjects) {
      const childKeys = extractJSONSchemaKeys(
        jsonSchema[key].schema,
        squashObjects
      )
      keys = keys.concat(
        childKeys.map(childKey => ({
          key: `${key}.${childKey.key}`,
          type: childKey.type,
        }))
      )
    } else if (type !== "array") {
      keys.push({ key, type })
    }
  })
  return keys
}
