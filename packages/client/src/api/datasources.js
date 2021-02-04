import { cloneDeep } from "lodash/fp"
import { fetchTableData, searchTableData } from "./tables"
import { fetchViewData } from "./views"
import { fetchRelationshipData } from "./relationships"
import { executeQuery } from "./queries"
import { enrichRows } from "./rows"

export const searchTable = async ({ tableId, search, pageSize }) => {
  const rows = await searchTableData(tableId, search, pageSize)
  return rows
  // Enrich rows so they can displayed properly
  // return await enrichRows(rows, tableId)
}

/**
 * Fetches all rows for a particular Budibase data source.
 */
export const fetchDatasource = async datasource => {
  if (!datasource || !datasource.type) {
    return []
  }

  // Fetch all rows in data source
  const { type, tableId, fieldName } = datasource
  let rows = []
  if (type === "table") {
    rows = await fetchTableData(tableId)
  } else if (type === "view") {
    rows = await fetchViewData(datasource)
  } else if (type === "query") {
    // Set the default query params
    let parameters = cloneDeep(datasource.queryParams || {})
    for (let param of datasource.parameters) {
      if (!parameters[param.name]) {
        parameters[param.name] = param.default
      }
    }
    return await executeQuery({ queryId: datasource._id, parameters })
  } else if (type === "link") {
    rows = await fetchRelationshipData({
      rowId: datasource.rowId,
      tableId: datasource.rowTableId,
      fieldName,
    })
  }

  // Enrich rows so they can displayed properly
  return await enrichRows(rows, tableId)
}
