export const buildViewV2Endpoints = API => ({
  /**
   * Create a new view
   * @param tableId the id of the table where the view will be created
   * @param view the view object
   */
  create: async view => {
    return await API.post({
      url: `/api/v2/views`,
      body: view,
    })
  },
  /**
   * Fetches all rows in a view
   * @param tableId the id of the table
   * @param viewId the id of the view
   */
  fetch: async viewId => {
    return await API.get({ url: `/api/v2/views/${viewId}/search` })
  },
  /**
   * Delete a view
   * @param tableId the id of the table
   * @param viewId the id of the view
   */
  delete: async (tableId, viewId) => {
    return await API.delete({ url: `/api/v2/views/${tableId}/${viewId}` })
  },
})
