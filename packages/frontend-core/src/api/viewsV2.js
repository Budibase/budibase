export const buildViewV2Endpoints = API => ({
  /**
   * Fetches the definition of a view
   * @param viewId the ID of the view to fetch
   */
  fetchDefinition: async viewId => {
    return await API.get({
      url: `/api/v2/views/${viewId}`,
    })
  },
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
   * @param query the search query
   * @param paginate whether to paginate or not
   * @param limit page size
   * @param bookmark pagination cursor
   * @param sort sort column
   * @param sortOrder sort order
   * @param sortType sort type (text or numeric)
   */
  fetch: async ({
    viewId,
    query,
    paginate,
    limit,
    bookmark,
    sort,
    sortOrder,
    sortType,
  }) => {
    return await API.post({
      url: `/api/v2/views/${viewId}/search`,
      body: {
        query,
        paginate,
        limit,
        bookmark,
        sort,
        sortOrder,
        sortType,
      },
    })
  },
  /**
   * Delete a view
   * @param viewId the id of the view
   */
  delete: async viewId => {
    return await API.delete({ url: `/api/v2/views/${viewId}` })
  },
})
