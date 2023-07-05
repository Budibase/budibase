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
   * @param tablesFilter a list of tables to actually fetch rather than simply
   * all that are accessible.
   */
  createDatasource: async ({ datasource, fetchSchema, tablesFilter }) => {
    return await API.post({
      url: "/api/datasources",
      body: {
        datasource,
        fetchSchema,
        tablesFilter,
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

  /**
   * Validate a datasource configuration
   * @param datasource the datasource configuration to validate
   */
  validateDatasource: async datasource => {
    return await API.post({
      url: `/api/datasources/verify`,
      body: { datasource },
    })
  },

  /**
   * Fetch table names available within the datasource, for filtering out undesired tables
   * @param datasource the datasource configuration to use for fetching tables
   */
  fetchInfoForDatasource: async datasource => {
    return await API.post({
      url: `/api/datasources/info`,
      body: { datasource },
    })
  },

  fetchExternalSchema: async datasourceId => {
    return await API.get({
      url: `/api/datasources/${datasourceId}/schema/external`,
    })
  },
})
