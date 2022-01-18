import { FIELDS } from "constants/backend"

function baseConversion(type) {
  if (type === "string") {
    return {
      type: FIELDS.STRING.type,
    }
  } else if (type === "boolean") {
    return {
      type: FIELDS.BOOLEAN.type,
    }
  } else if (type === "number") {
    return {
      type: FIELDS.NUMBER.type,
    }
  }
}

function recurse(schemaLevel = {}, objectLevel) {
  if (!objectLevel) {
    return null
  }
  const baseType = typeof objectLevel
  if (baseType !== "object") {
    return baseConversion(baseType)
  }
  for (let [key, value] of Object.entries(objectLevel)) {
    const type = typeof value
    // check array first, since arrays are objects
    if (Array.isArray(value)) {
      const schema = recurse(schemaLevel[key], value[0])
      if (schema) {
        schemaLevel[key] = {
          type: FIELDS.ARRAY.type,
          schema,
        }
      }
    } else if (type === "object") {
      const schema = recurse(schemaLevel[key], objectLevel[key])
      if (schema) {
        schemaLevel[key] = schema
      }
    } else {
      schemaLevel[key] = baseConversion(type)
    }
  }
  if (!schemaLevel.type) {
    return { type: FIELDS.JSON.type, schema: schemaLevel }
  } else {
    return schemaLevel
  }
}

export function generate(object) {
  return recurse({}, object).schema
}
