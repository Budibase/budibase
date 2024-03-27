import { FieldType } from "@budibase/types"

function baseConversion(type) {
  if (type === "string") {
    return {
      type: FieldType.STRING,
    }
  } else if (type === "boolean") {
    return {
      type: FieldType.BOOLEAN,
    }
  } else if (type === "number") {
    return {
      type: FieldType.NUMBER,
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
          type: FieldType.ARRAY,
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
    return { type: FieldType.JSON, schema: schemaLevel }
  } else {
    return schemaLevel
  }
}

export function generate(object) {
  return recurse({}, object).schema
}
