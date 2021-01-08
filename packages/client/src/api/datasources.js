import { fetchTableData } from "./tables"
import { fetchViewData } from "./views"
import { fetchRelationshipData } from "./relationships"
import { executeQuery } from "./queries"
import { enrichRows } from "./rows"
import { enrichDataBindings } from "../utils/enrichDataBinding"

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
    console.log("Query Datasource", datasource)
    console.log("Data Context", dataContext)
    // TODO: You left here
    const parameters = enrichDataBindings(datasource.queryParams, dataContext)
    console.log("PARSED PARAMS", parameters)
    return await executeQuery({ _id: datasource._id, parameters })
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
