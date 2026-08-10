import {
  FieldType,
  type Row,
  type Table,
  type TableSchema,
} from "@budibase/types"

export const getAgentTableSchema = (schema: TableSchema): TableSchema =>
  Object.fromEntries(
    Object.entries(schema).filter(([, field]) => field.type !== FieldType.LINK)
  )

export const getAgentTableFields = (schema: TableSchema): string[] =>
  Object.entries(schema)
    .filter(([, field]) => field.type !== FieldType.LINK)
    .map(([name]) => name)

export const sanitizeAgentRow = (row: Row, schema: TableSchema): Row => {
  const relationshipFields = new Set(
    Object.entries(schema)
      .filter(([, field]) => field.type === FieldType.LINK)
      .map(([name]) => name)
  )

  return Object.fromEntries(
    Object.entries(row).filter(([name]) => !relationshipFields.has(name))
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
