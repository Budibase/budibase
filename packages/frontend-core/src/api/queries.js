export const buildQueryEndpoints = API => ({
  /**
   * Executes a query against an external data connector.
   */
  executeQuery: async ({ queryId, pagination, parameters }) => {
    return await API.post({
      url: `/api/v2/queries/${queryId}`,
      body: {
        parameters,
        pagination,
      },
    })
  },

  /**
   * Fetches the definition of an external query.
   */
  fetchQueryDefinition: async queryId => {
    return await API.get({
      url: `/api/queries/${queryId}`,
      cache: true,
    })
  },
})
