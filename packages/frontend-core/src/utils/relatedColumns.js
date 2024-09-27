import { FieldType, RelationshipType } from "@budibase/types"
import { Helpers } from "@budibase/bbui"

const columnTypeManyTypeOverrides = {
  [FieldType.DATETIME]: FieldType.STRING,
  [FieldType.BOOLEAN]: FieldType.STRING,
  [FieldType.SIGNATURE_SINGLE]: FieldType.ATTACHMENTS,
}

const columnTypeManyParser = {
  [FieldType.DATETIME]: (value, field) => {
    function parseDate(value) {
      const { timeOnly, dateOnly, ignoreTimezones } = field || {}
      const enableTime = !dateOnly
      const parsedValue = Helpers.parseDate(value, {
        timeOnly,
        enableTime,
        ignoreTimezones,
      })
      const parsed = Helpers.getDateDisplayValue(parsedValue, {
        enableTime,
        timeOnly,
      })
      return parsed
    }

    return value?.map(v => parseDate(v))
  },
  [FieldType.BOOLEAN]: value => value?.map(v => !!v),
  [FieldType.BB_REFERENCE_SINGLE]: value => [
    ...new Map(value.map(i => [i._id, i])).values(),
  ],
  [FieldType.BB_REFERENCE]: value => [
    ...new Map(value.map(i => [i._id, i])).values(),
  ],
  [FieldType.ARRAY]: value => Array.from(new Set(value)),
}

export function enrichSchemaWithRelColumns(schema) {
  if (!schema) {
    return
  }
  const result = Object.keys(schema).reduce((result, fieldName) => {
    const field = schema[fieldName]
    result[fieldName] = field

    if (field.visible !== false && field.columns) {
      const fromSingle =
        field?.relationshipType === RelationshipType.ONE_TO_MANY

      for (const relColumn of Object.keys(field.columns)) {
        const relField = field.columns[relColumn]
        if (!relField.visible) {
          continue
        }
        const name = `${field.name}.${relColumn}`
        result[name] = {
          ...relField,
          name,
          related: { field: fieldName, subField: relColumn },
          cellRenderType:
            (!fromSingle && columnTypeManyTypeOverrides[relField.type]) ||
            relField.type,
        }
      }
    }
    return result
  }, {})

  return result
}

export function getRelatedTableValues(row, field, fromField) {
  const fromSingle =
    fromField?.relationshipType === RelationshipType.ONE_TO_MANY

  let result = ""

  if (fromSingle) {
    result = row[field.related.field]?.[0]?.[field.related.subField]
  } else {
    const parser = columnTypeManyParser[field.type] || (value => value)

    result = parser(
      row[field.related.field]
        ?.flatMap(r => r[field.related.subField])
        ?.filter(i => i !== undefined && i !== null),
      field
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
      result = result?.join(", ")
    }
  }

  return result
}
