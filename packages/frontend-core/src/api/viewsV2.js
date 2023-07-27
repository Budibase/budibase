export const buildViewV2Endpoints = API => ({
  /**
   * Create a new view
   * @param view the view object
   */
  create: async view => {
    return await API.post({
      url: `/api/v2/views`,
      body: view,
    })
  },
  /**
   * Updates a view
   * @param view the view object
   */
  update: async view => {
    return await API.put({
      url: `/api/v2/views/${view.id}`,
      body: view,
    })
  },
  /**
   * Fetches all rows in a view
   * @param viewId the id of the view
   */
  fetch: async viewId => {
    return await API.get({ url: `/api/v2/views/${viewId}/search` })
  },
  /**
   * Delete a view
   * @param viewId the id of the view
   */
  delete: async viewId => {
    return await API.delete({ url: `/api/v2/views/${viewId}` })
  },
})
