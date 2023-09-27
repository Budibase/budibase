export const buildTableEndpoints = API => ({
  /**
   * Fetches a table definition.
   * Since definitions cannot change at runtime, the result is cached.
   * @param tableId the ID of the table to fetch
   */
  fetchTableDefinition: async tableId => {
    return await API.get({
      url: `/api/tables/${tableId}`,
      cache: true,
    })
  },

  /**
   * Fetches all rows from a table.
   * @param tableId the ID of the table for fetch
   */
  fetchTableData: async tableId => {
    return await API.get({ url: `/api/${tableId}/rows` })
  },

  /**
   * Searches a table using Lucene.
   * @param tableId the ID of the table to search
   * @param query the lucene search query
   * @param bookmark the current pagination bookmark
   * @param limit the number of rows to retrieve
   * @param sort the field to sort by
   * @param sortOrder the order to sort by
   * @param sortType the type to sort by, either numerically or alphabetically
   * @param paginate whether to paginate the data
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

  /**
   * Imports data into an existing table
   * @param tableId the table ID to import to
   * @param rows the data import object
   * @param identifierFields column names to be used as keys for overwriting existing rows
   */
  importTableData: async ({ tableId, rows, identifierFields }) => {
    return await API.post({
      url: `/api/tables/${tableId}/import`,
      body: {
        rows,
        identifierFields,
      },
    })
  },
  csvToJson: async csvString => {
    return await API.post({
      url: "/api/convert/csvToJson",
      body: {
        csvString,
      },
    })
  },

  /**
   * Gets a list of tables.
   */
  getTables: async () => {
    return await API.get({
      url: "/api/tables",
    })
  },

  /**
   * Get a single table based on table ID.
   */
  getTable: async tableId => {
    return await API.get({
      url: `/api/tables/${tableId}`,
    })
  },

  /**
   * Saves a table.
   * @param table the table to save
   */
  saveTable: async table => {
    return await API.post({
      url: "/api/tables",
      body: table,
    })
  },

  /**
   * Deletes a table.
   * @param tableId the ID of the table to delete
   * @param tableRev the rev of the table to delete
   */
  deleteTable: async ({ tableId, tableRev }) => {
    return await API.delete({
      url: `/api/tables/${tableId}/${tableRev}`,
    })
  },
  validateNewTableImport: async ({ rows, schema }) => {
    return await API.post({
      url: "/api/tables/validateNewTableImport",
      body: {
        rows,
        schema,
      },
    })
  },
  validateExistingTableImport: async ({ rows, tableId }) => {
    return await API.post({
      url: "/api/tables/validateExistingTableImport",
      body: {
        rows,
        tableId,
      },
    })
  },
})
