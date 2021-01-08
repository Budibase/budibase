import API from "./api"

/**
 * Executes a query against an external data connector.
 */
export const executeQuery = async ({ queryId, parameters }) => {
  const response = await API.post({
    url: `/api/queries/${queryId}`,
    body: {
      parameters,
    },
  })
  return response.rows
}
