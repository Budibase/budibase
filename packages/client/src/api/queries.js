import { notificationStore } from "../store/notification"
import API from "./api"

/**
 * Executes a query against an external data connector.
 */
export const executeQuery = async ({ queryId, parameters, notify = false }) => {
  const res = await API.post({
    url: `/api/queries/${queryId}`,
    body: {
      parameters,
    },
  })
  if (res.error) {
    notificationStore.danger("An error has occurred")
  } else if (notify) {
    notificationStore.success("Query executed successfully")
  }
  return res
}
