import API from "./api"

/**
 * Fetches all rows from a query.
 */
export const fetchQueryData = async ({ _id }) => {
  const response = await API.get({
    url: `/api/queries/${_id}`,
  })
  return response.rows
}

/**
 * Executes a query against an external data connector.
 */
export const executeQuery = async ({ queryId, params }) => {
  const response = await API.post({
    url: `/api/queries/${queryId}`,
    body: {
      params,
    },
  })
  return response.rows
}
