import { helpers } from "@budibase/shared-core"
import { TypeIconMap } from "../constants"
import { convertJSONSchemaToTableSchema } from "./json"

export const getColumnIcon = column => {
  // For some reason we have remix icons saved under this property sometimes,
  // so we must ignore those as they are invalid spectrum icons
  if (column.schema.icon && !column.schema.icon.startsWith("ri-")) {
    return column.schema.icon
  }
  if (column.calculationType) {
    return "calculator"
  }
  if (column.schema.autocolumn) {
    return "shapes"
  }
  if (helpers.schema.isDeprecatedSingleUserColumn(column.schema)) {
    return "user"
  }
  const { type, subtype } = column.schema
  const result =
    typeof TypeIconMap[type] === "object" && subtype
      ? TypeIconMap[type][subtype]
      : TypeIconMap[type]

  return result || "article"
}

export const addNestedJSONSchemaFields = schema => {
  if (!schema) {
    return schema
  }
  let jsonAdditions = {}
  Object.keys(schema).forEach(fieldKey => {
    const fieldSchema = schema[fieldKey]
    if (fieldSchema?.type === "json") {
      const jsonSchema = convertJSONSchemaToTableSchema(fieldSchema, {
        squashObjects: true,
      })
      Object.keys(jsonSchema).forEach(jsonKey => {
        jsonAdditions[`${fieldKey}.${jsonKey}`] = {
          type: jsonSchema[jsonKey].type,
          nestedJSON: true,
        }
      })
    }
  })
  return { ...schema, ...jsonAdditions }
}
