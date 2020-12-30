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
