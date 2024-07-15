import { BannedSearchTypes } from "../constants"

export function getTableFields(tables, linkField) {
  const table = tables.find(table => table._id === linkField.tableId)
  if (!table || !table.sql) {
    return []
  }
  const linkFields = getFields(tables, Object.values(table.schema), {
    allowLinks: false,
  })
  return linkFields.map(field => ({
    ...field,
    name: `${linkField.name}.${field.name}`,
  }))
}

export function getFields(
  tables,
  fields,
  { allowLinks } = { allowLinks: true }
) {
  let filteredFields = fields.filter(
    field => !BannedSearchTypes.includes(field.type)
  )
  if (allowLinks) {
    const linkFields = fields.filter(field => field.type === "link")
    for (let linkField of linkFields) {
      // only allow one depth of SQL relationship filtering
      filteredFields = filteredFields.concat(getTableFields(tables, linkField))
    }
  }
  const staticFormulaFields = fields.filter(
    field => field.type === "formula" && field.formulaType === "static"
  )
  return filteredFields.concat(staticFormulaFields)
}
