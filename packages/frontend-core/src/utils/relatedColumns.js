import { FieldType, RelationshipType } from "@budibase/types"
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
  [FieldType.BOOLEAN]: {
    overridedType: FieldType.STRING,
    parser: value => !!value,
  },
  [FieldType.SIGNATURE_SINGLE]: {
    overridedType: FieldType.ATTACHMENTS,
  },
  [FieldType.BB_REFERENCE_SINGLE]: {
    parser: value => [...new Map(value.map(i => [i._id, i])).values()],
  },
  [FieldType.BB_REFERENCE]: {
    parser: value => [...new Map(value.map(i => [i._id, i])).values()],
  },
  [FieldType.ARRAY]: {
    parser: value => Array.from(new Set(value)),
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
      const fromSingle =
        field?.relationshipType === RelationshipType.ONE_TO_MANY

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
            (!fromSingle &&
              columnTypeManyOverrides[relField.type]?.overridedType) ||
            relField.type,
        }
      }
    }
    return acc
  }, {})

  return result
}

export function getRelatedTableValues(row, field, fromField) {
  const fromSingle =
    fromField?.relationshipType === RelationshipType.ONE_TO_MANY

  let result = ""
  try {
    if (fromSingle) {
      result = row[field.related.field]?.[0]?.[field.related.subField]
    } else {
      const parser =
        columnTypeManyOverrides[field.type]?.parser || (value => value)

      result = parser(
        row[field.related.field].flatMap(r => r[field.related.subField], field)
      )

      if (
        [
          FieldType.STRING,
          FieldType.NUMBER,
          FieldType.BIGINT,
          FieldType.BOOLEAN,
          FieldType.DATETIME,
          FieldType.LONGFORM,
          FieldType.BARCODEQR,
        ].includes(field.type)
      ) {
        result = result.join(", ")
      }
    }
  } catch (e) {
    result = "Not rendable"
    console.error(e.message)
  }

  return result
}
