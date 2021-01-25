import { notificationStore } from "../store/notification"
import API from "./api"

/**
 * Executes a query against an external data connector.
 */
export const executeQuery = async ({ queryId, parameters }) => {
  const res = await API.post({
    url: `/api/queries/${queryId}`,
    body: {
      parameters,
    },
  })
  res.error
    ? notificationStore.danger("An error has occurred")
    : notificationStore.success("Query successful")
  return res
}
