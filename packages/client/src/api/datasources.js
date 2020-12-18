import { fetchTableData } from "./tables"
import { fetchViewData } from "./views"
import { fetchRelationshipData } from "./relationships"
import { enrichRows } from "./rows"
import { fetchDataForQuery } from "../../../builder/src/components/backend/DataTable/api"

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
  } else if (type === "query") {
    rows = await fetchDataForQuery(datasource)
  } else if (type === "link") {
    const row = dataContext[datasource.providerId]
    rows = await fetchRelationshipData({
      rowId: row?._id,
      tableId: row?.tableId,
      fieldName,
    })
  }
  // Enrich rows
  return await enrichRows(rows, tableId)
}
