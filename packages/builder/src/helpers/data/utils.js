export function schemaToFields(schema) {
  const response = {}
  if (schema && typeof schema === "object") {
    for (let [field, value] of Object.entries(schema)) {
      response[field] = value?.type || "string"
    }
  }
  return response
}

export function fieldsToSchema(fields) {
  const response = {}
  if (fields && typeof fields === "object") {
    for (let [name, type] of Object.entries(fields)) {
      response[name] = { name, type }
    }
  }
  return response
}
