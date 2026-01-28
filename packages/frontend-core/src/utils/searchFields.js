import { BannedSearchTypes } from "../constants"

export function getTableFields(tables, linkField) {
  const table = tables.find(table => table._id === linkField.tableId)
  if (!table || !table.sql) {
    return []
  }
  const linkFields = getFields(tables, Object.values(table.schema), {
    allowLinks: false,
  })
  return linkFields
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(field => ({
      ...field,
      name: `${linkField.name}.${field.name}`,
    }))
}

export function getFields(
  tables,
  fields,
  { allowLinks } = { allowLinks: true }
) {
  const result = []
  let filteredFields = fields.filter(
    field => !BannedSearchTypes.includes(field.type)
  )
  for (const field of filteredFields) {
    result.push(field)

    if (allowLinks && field.type === "link") {
      // only allow one depth of SQL relationship filtering
      result.push(...getTableFields(tables, field))
    }
  }
  const staticFormulaFields = fields.filter(
    field => field.type === "formula" && field.formulaType === "static"
  )
  return result.concat(staticFormulaFields)
}
