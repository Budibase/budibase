import { fetchTableData } from "./tables"
import { fetchViewData } from "./views"
import { fetchRelationshipData } from "./relationships"
import { enrichRows } from "./rows"

/**
 * Fetches all rows for a particular Budibase data source.
 */
export const fetchDatasource = async (datasource, dataContext) => {
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
  } else if (type === "link") {
    rows = await fetchRelationshipData({
      rowId: dataContext?._id,
      tableId: dataContext?.tableId,
      fieldName,
    })
  }

  // Enrich rows
  return await enrichRows(rows, tableId)
}
