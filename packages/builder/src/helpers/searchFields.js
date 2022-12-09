import { tables } from "../stores/backend"
import { BannedSearchTypes } from "../constants/backend"
import { get } from "svelte/store"

export function getTableFields(linkField) {
  const table = get(tables).list.find(table => table._id === linkField.tableId)
  if (!table || !table.sql) {
    return []
  }
  const linkFields = getFields(Object.values(table.schema), {
    allowLinks: false,
  })
  return linkFields.map(field => ({
    ...field,
    name: `${table.name}.${field.name}`,
  }))
}

export function getFields(
  fields,
  { allowLinks } = { allowLinks: true },
  tableId
) {
  let filteredFields = fields.filter(
    field => !BannedSearchTypes.includes(field.type)
  )
  if (allowLinks) {
    const linkFields = fields.filter(field => field.type === "link")
    for (let linkField of linkFields) {
      // only allow one depth of SQL relationship filtering
      filteredFields = filteredFields.concat(getTableFields(linkField))
    }
  }
  const staticFormulaFields = fields.filter(
    field => field.type === "formula" && field.formulaType === "static"
  )
  const table = get(tables).list.find(table => table._id === tableId)
  if (table?.type === "external" && table?.sql) {
    filteredFields = filteredFields.filter(field => field.name !== "_id")
  }
  return filteredFields.concat(staticFormulaFields)
}
