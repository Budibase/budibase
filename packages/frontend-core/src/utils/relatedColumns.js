import { FieldType } from "@budibase/types"

export function enrichSchemaWithRelColumns(schema) {
  if (!schema) {
    return
  }
  const result = Object.keys(schema).reduce((acc, c) => {
    const field = schema[c]
    acc[c] = field

    if (field.visible !== false && field.columns) {
      for (const relColumn of Object.keys(field.columns)) {
        const relField = field.columns[relColumn]
        if (!relField.visible) {
          continue
        }
        const name = `${field.name}.${relColumn}`
        acc[name] = {
          ...relField,
          name,
          related: { field: c, subField: relColumn },
        }
      }
    }
    return acc
  }, {})

  return result
}

export function getRelatedTableValues(row, field, isSingle) {
  let result = ""
  try {
    if (isSingle) {
      result = row[field.related.field]?.[0]?.[field.related.subField]
    } else {
      result = Array.from(
        new Set(
          row[field.related.field].flatMap(r => r[field.related.subField])
        )
      )
      switch (field.type) {
        case FieldType.STRING:
        case FieldType.NUMBER:
        case FieldType.BIGINT:
        case FieldType.BARCODEQR:
          result = result.join(", ")
          break
      }
    }
  } catch (e) {
    result = "Not rendable"
    console.error(e.message)
  }

  return result
}
