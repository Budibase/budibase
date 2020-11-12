import { fetchTableData, fetchTableDefinition } from "./tables"
import { fetchViewData } from "./views"
import { fetchRelationshipData } from "./relationships"

/**
 * Fetches all rows for a particular Budibase data source.
 */
export const fetchDatasource = async datasource => {
  if (!datasource || !datasource.name) {
    return []
  }

  // Fetch all rows in data source
  const { type, name, tableId } = datasource
  let rows = []
  if (type === "table") {
    rows = await fetchTableData(name)
  } else if (type === "view") {
    rows = await fetchViewData(datasource)
  } else if (type === "link") {
    rows = await fetchRelationshipData(tableId)
  }

  // Enrich rows
  return await enrichDatasourceRows(rows, tableId)
}

/**
 * Enriches data source rows which contain certain field types so that they can
 * be properly displayed.
 */
const enrichDatasourceRows = async (rows, tableId) => {
  if (rows && rows.length && tableId) {
    // Fetch table schema so we can check column types
    const tableDefinition = await fetchTableDefinition(tableId)
    const schema = tableDefinition && tableDefinition.schema
    if (schema) {
      const keys = Object.keys(schema)
      rows.forEach(row => {
        for (let key of keys) {
          const type = schema[key].type
          if (type === "link") {
            // Enrich row with the count of any relationship fields
            row[`${key}_count`] = Array.isArray(row[key]) ? row[key].length : 0
          } else if (type === "attachment") {
            // Enrich row with the first image URL for any attachment fields
            let url = null
            if (Array.isArray(row[key]) && row[key][0] != null) {
              url = row[key][0].url
            }
            row[`${key}_first`] = url
          }
        }
      })
    }
  }
  return rows
}
