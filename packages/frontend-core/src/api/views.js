export const buildViewEndpoints = API => ({
  /**
   * Fetches all rows in a view.
   */
  fetchViewData: async ({ name, field, groupBy, calculation }) => {
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
    return await API.get({ url: QUERY_VIEW_URL })
  },
})
