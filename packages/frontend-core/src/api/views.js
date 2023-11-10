export const buildViewEndpoints = API => ({
  /**
   * Fetches all rows in a view
   * @param name the name of the view
   * @param field the field to perform the calculation on
   * @param groupBy the field to group by
   * @param calculation the calculation to perform
   */
  fetchViewData: async ({ name, field, groupBy, calculation }) => {
    const params = new URLSearchParams()
    if (calculation) {
      params.set("field", field)
      params.set("calculation", calculation)
    }
    if (groupBy) {
      params.set("group", groupBy)
    }
    const QUERY_VIEW_URL = field
      ? `/api/views/${encodeURIComponent(name)}?${params}`
      : `/api/views/${encodeURIComponent(name)}`
    return await API.get({ url: QUERY_VIEW_URL })
  },

  /**
   * Exports a view for download
   * @param viewName the view to export
   * @param format the format to download
   */
  exportView: async ({ viewName, format }) => {
    const safeViewName = encodeURIComponent(viewName)
    return await API.get({
      url: `/api/views/export?view=${safeViewName}&format=${format}`,
      parseResponse: async response => {
        return await response.text()
      },
    })
  },

  /**
   * Saves a view.
   * @param view the view to save
   */
  saveView: async view => {
    return await API.post({
      url: "/api/views",
      body: view,
    })
  },

  /**
   * Deletes a view.
   * @param viewName the name of the view to delete
   */
  deleteView: async viewName => {
    return await API.delete({
      url: `/api/views/${encodeURIComponent(viewName)}`,
    })
  },
})
