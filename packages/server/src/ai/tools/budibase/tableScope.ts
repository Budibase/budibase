import {
  FieldType,
  type Row,
  type Table,
  type TableSchema,
} from "@budibase/types"

const isAgentField = (field: TableSchema[string]) =>
  ![FieldType.LINK, FieldType.FORMULA].includes(field.type)

export const getAgentTableSchema = (schema: TableSchema): TableSchema =>
  Object.fromEntries(
    Object.entries(schema).filter(([, field]) => isAgentField(field))
  )

export const getAgentTableFields = (schema: TableSchema): string[] =>
  Object.entries(schema)
    .filter(([, field]) => isAgentField(field))
    .map(([name]) => name)

export const sanitizeAgentRow = (row: Row, schema: TableSchema): Row => {
  const excludedFields = new Set(
    Object.entries(schema)
      .filter(([, field]) => !isAgentField(field))
      .map(([name]) => name)
  )

  return Object.fromEntries(
    Object.entries(row).filter(([name]) => !excludedFields.has(name))
  )
}

export const sanitizeAgentTable = (table: Table) => {
  const schema = getAgentTableSchema(table.schema)
  const primaryDisplay = table.primaryDisplay

  return {
    ...table,
    primaryDisplay:
      primaryDisplay && schema[primaryDisplay] ? primaryDisplay : undefined,
    schema,
  }
}
