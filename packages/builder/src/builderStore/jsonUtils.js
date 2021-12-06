export const convertJSONSchemaToTableSchema = (
  jsonSchema,
  squashObjects = false
) => {
  if (!jsonSchema) {
    return null
  }
  if (jsonSchema.schema) {
    jsonSchema = jsonSchema.schema
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
      const childKeys = extractJSONSchemaKeys(jsonSchema[key].schema)
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
