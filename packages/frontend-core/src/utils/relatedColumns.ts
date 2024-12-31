import { Helpers } from "@budibase/bbui"
import {
  FieldType,
  isRelationshipField,
  RelationshipType,
  Row,
  UIFieldSchema,
} from "@budibase/types"

const columnTypeManyTypeOverrides: Partial<Record<FieldType, FieldType>> = {
  [FieldType.DATETIME]: FieldType.STRING,
  [FieldType.BOOLEAN]: FieldType.STRING,
  [FieldType.SIGNATURE_SINGLE]: FieldType.ATTACHMENTS,
}

const columnTypeManyParser = {
  [FieldType.DATETIME]: (
    value: any[],
    field: {
      timeOnly?: boolean
      dateOnly?: boolean
    }
  ) => {
    function parseDate(value: any) {
      const { timeOnly, dateOnly } = field || {}
      const enableTime = !dateOnly
      const parsedValue = Helpers.parseDate(value, { enableTime })
      const parsed = Helpers.getDateDisplayValue(parsedValue, {
        enableTime,
        timeOnly,
      })
      return parsed
    }

    return value.map(v => parseDate(v))
  },
  [FieldType.BOOLEAN]: (value: any[]) => value.map(v => !!v),
  [FieldType.BB_REFERENCE_SINGLE]: (value: any[]) => [
    ...new Map(value.map(i => [i._id, i])).values(),
  ],
  [FieldType.BB_REFERENCE]: (value: any[]) => [
    ...new Map(value.map(i => [i._id, i])).values(),
  ],
  [FieldType.ARRAY]: (value: any[]) => Array.from(new Set(value)),
}

export function enrichSchemaWithRelColumns(
  schema: Record<string, UIFieldSchema>
): Record<string, UIFieldSchema> {
  const result = Object.keys(schema).reduce<Record<string, UIFieldSchema>>(
    (result, fieldName) => {
      const field = schema[fieldName]
      result[fieldName] = field

      if (
        field.visible !== false &&
        isRelationshipField(field) &&
        field.columns
      ) {
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
            type: relField.type as any, // TODO
            name,
            related: { field: fieldName, subField: relColumn },
            cellRenderType:
              (!fromSingle && columnTypeManyTypeOverrides[relField.type]) ||
              relField.type,
          }
        }
      }
      return result
    },
    {}
  )

  return result
}

export function getRelatedTableValues(
  row: Row,
  field: UIFieldSchema & { related: { field: string; subField: string } },
  fromField: UIFieldSchema
) {
  const fromSingle =
    isRelationshipField(fromField) &&
    fromField?.relationshipType === RelationshipType.ONE_TO_MANY

  let result = ""

  if (fromSingle) {
    result = row[field.related.field]?.[0]?.[field.related.subField]
  } else {
    const parser =
      columnTypeManyParser[field.type as keyof typeof columnTypeManyParser] ||
      ((value: any) => value)
    const value = row[field.related.field]
      ?.flatMap((r: Row) => r[field.related.subField])
      ?.filter((i: any) => i !== undefined && i !== null)
    const parsed = parser(value || [], field as any)
    result = parsed as any
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
      result = parsed?.join(", ")
    }
  }

  return result
}
