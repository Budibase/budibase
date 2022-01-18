import API from "./api"
import { enrichRows } from "./rows"

/**
 * Fetches all rows in a view.
 */
export const fetchViewData = async ({
  name,
  field,
  groupBy,
  calculation,
  tableId,
}) => {
  const params = new URLSearchParams()

  if (calculation) {
    params.set("field", field)
    params.set("calculation", calculation)
  }
  if (groupBy) {
    params.set("group", groupBy ? "true" : "false")
  }

  const QUERY_VIEW_URL = field
    ? `/api/views/${name}?${params}`
    : `/api/views/${name}`

  const rows = await API.get({ url: QUERY_VIEW_URL })
  return await enrichRows(rows, tableId)
}
