export const buildTableEndpoints = API => ({
  /**
   * Fetches a table definition.
   * Since definitions cannot change at runtime, the result is cached.
   */
  fetchTableDefinition: async tableId => {
    return await API.get({
      url: `/api/tables/${tableId}`,
      cache: true,
    })
  },

  /**
   * Fetches all rows from a table.
   */
  fetchTableData: async tableId => {
    return await API.get({ url: `/api/${tableId}/rows` })
  },

  /**
   * Searches a table using Lucene.
   */
  searchTable: async ({
    tableId,
    query,
    bookmark,
    limit,
    sort,
    sortOrder,
    sortType,
    paginate,
  }) => {
    if (!tableId || !query) {
      return {
        rows: [],
      }
    }
    return await API.post({
      url: `/api/${tableId}/search`,
      body: {
        query,
        bookmark,
        limit,
        sort,
        sortOrder,
        sortType,
        paginate,
      },
    })
  },
})
