export const buildViewV2Endpoints = API => ({
  /**
   * Fetches all rows in a view
   * @param id the id of the view
   */
  get: async id => {
    return await API.get({ url: `/api/v2/views/${id}` })
  },
  /**
   * Get a view information
   * @param id the id of the view
   */
  fetch: async id => {
    return await API.get({ url: `/api/v2/views/${id}/search` })
  },
})
