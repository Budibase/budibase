import { notificationStore, datasourceStore } from "../store"
import API from "./api"

/**
 * Executes a query against an external data connector.
 */
export const executeQuery = async ({ queryId, parameters }) => {
  const query = await API.get({ url: `/api/queries/${queryId}` })
  if (query?.datasourceId == null) {
    notificationStore.danger("That query couldn't be found")
    return
  }
  const res = await API.post({
    url: `/api/queries/${queryId}`,
    body: {
      parameters,
    },
  })
  if (res.error) {
    notificationStore.danger("An error has occurred")
  } else if (!query.readable) {
    notificationStore.success("Query executed successfully")
    datasourceStore.actions.invalidateDatasource(query.datasourceId)
  }
  return res
}
