import { get } from "svelte/store"
import { fetchTableData } from "./tables"
import { fetchViewData } from "./views"
import { fetchRelationshipData } from "./relationships"
import { executeQuery } from "./queries"
import { enrichRows } from "./rows"
import { enrichDataBindings } from "../utils/enrichDataBinding"
import { bindingStore } from "../store/binding"

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
    const bindings = get(bindingStore)

    // Set the default query params
    let queryParams = datasource.queryParams || {}
    for (let param of datasource.parameters) {
      if (!queryParams[param.name]) {
        queryParams[param.name] = param.default
      }
    }
    const parameters = enrichDataBindings(queryParams, {
      ...bindings,
      ...dataContext,
    })
    return await executeQuery({ queryId: datasource._id, parameters })
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
