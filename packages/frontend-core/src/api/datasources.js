export const buildDatasourceEndpoints = API => ({
  /**
   * Gets a list of datasources.
   */
  getDatasources: async () => {
    return await API.get({
      url: "/api/datasources",
    })
  },

  /**
   * Prompts the server to build the schema for a datasource.
   * @param datasourceId the datasource ID to build the schema for
   * @param tablesFilter list of specific table names to be build the schema
   */
  buildDatasourceSchema: async ({ datasourceId, tablesFilter }) => {
    return await API.post({
      url: `/api/datasources/${datasourceId}/schema`,
      body: {
        tablesFilter,
      },
    })
  },

  /**
   * Creates a datasource
   * @param datasource the datasource to create
   * @param fetchSchema whether to fetch the schema or not
   */
  createDatasource: async ({ datasource, fetchSchema }) => {
    return await API.post({
      url: "/api/datasources",
      body: {
        datasource,
        fetchSchema,
      },
    })
  },

  /**
   * Updates a datasource
   * @param datasource the datasource to update
   */
  updateDatasource: async datasource => {
    return await API.put({
      url: `/api/datasources/${datasource._id}`,
      body: datasource,
    })
  },

  /**
   * Deletes a datasource.
   * @param datasourceId the ID of the ddtasource to delete
   * @param datasourceRev the rev of the datasource to delete
   */
  deleteDatasource: async ({ datasourceId, datasourceRev }) => {
    return await API.delete({
      url: `/api/datasources/${datasourceId}/${datasourceRev}`,
    })
  },
})
