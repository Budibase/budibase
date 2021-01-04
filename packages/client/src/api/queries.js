import API from "./api"

/**
 * Fetches all rows from a query.
 */
export const fetchQueryData = async ({ datasourceId, queryId }) => {
  const response = await API.get({
    url: `/api/datasources/${datasourceId}/queries/${queryId}`,
  })
  return response.rows
}

/**
 * Executes a query against an external data connector.
 */
export const executeQuery = async ({ datasourceId, queryId }) => {
  const response = await API.post({
    url: `/api/datasources/${datasourceId}/queries/${queryId}`,
    // body: params,
  })
  return response.rows
}
