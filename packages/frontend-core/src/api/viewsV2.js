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
   * @param paginate whether to paginate or not
   * @param limit page size
   * @param bookmark pagination cursor
   * @param sort sort column
   * @param sortOrder sort order
   * @param sortType sort type (text or numeric)
   */
  fetch: async ({
    viewId,
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
  /**
   * Creates a row from a view
   * @param row the row to create
   * @param suppressErrors whether or not to suppress error notifications
   */
  createRow: async (row, suppressErrors = false) => {
    if (!row?._viewId || !row?.tableId) {
      return
    }
    return await API.post({
      url: `/api/v2/views/${row._viewId}/rows`,
      body: row,
      suppressErrors,
    })
  },
  /**
   * Updates an existing row through a view
   * @param row the row to update
   * @param suppressErrors whether or not to suppress error notifications
   */
  updateRow: async (row, suppressErrors = false) => {
    if (!row?._viewId || !row?.tableId || !row?._id) {
      return
    }
    return await API.patch({
      url: `/api/v2/views/${row._viewId}/rows/${row._id}`,
      body: row,
      suppressErrors,
    })
  },
  /**
   * Deletes multiple rows from a table through a view
   * @param viewId the table ID to delete the rows from
   * @param rows the array of rows to delete
   */
  deleteRows: async ({ viewId, rows }) => {
    // Ensure we delete _viewId from rows as otherwise this throws a 500
    rows?.forEach(row => {
      delete row?._viewId
    })
    return await API.delete({
      url: `/api/v2/views/${viewId}/rows`,
      body: {
        rows,
      },
    })
  },
})
