import { FieldType } from "@budibase/types"
import { Helpers } from "@budibase/bbui"

const columnTypeManyOverrides = {
  [FieldType.DATETIME]: {
    overridedType: FieldType.STRING,
    parser: (value, field) => {
      const { timeOnly, dateOnly, ignoreTimezones } = field
      const enableTime = !dateOnly
      const parsedValue = Helpers.parseDate(value, {
        timeOnly,
        enableTime,
        ignoreTimezones,
      })
      const result = Helpers.getDateDisplayValue(parsedValue, {
        enableTime,
        timeOnly,
      })
      return result
    },
  },
}

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
          cellRenderType:
            columnTypeManyOverrides[relField.type]?.overridedType ||
            relField.type,
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
      const parser =
        columnTypeManyOverrides[field.type]?.parser || (value => value)
      result = Array.from(
        new Set(
          row[field.related.field].flatMap(r =>
            parser(r[field.related.subField], field)
          )
        )
      ).join(", ")
    }
  } catch (e) {
    result = "Not rendable"
    console.error(e.message)
  }

  return result
}
