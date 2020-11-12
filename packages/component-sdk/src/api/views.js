import api from "./api"

/**
 * Fetches all rows in a view.
 */
export const fetchViewData = async ({ name, field, groupBy, calculation }) => {
  const params = new URLSearchParams()

  if (calculation) {
    params.set("field", field)
    params.set("calculation", calculation)
  }
  if (groupBy) {
    params.set("group", groupBy)
  }

  const QUERY_VIEW_URL = field
    ? `/api/views/${name}?${params}`
    : `/api/views/${name}`

  return await api.get({ url: QUERY_VIEW_URL })
}
