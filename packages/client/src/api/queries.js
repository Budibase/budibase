import { notificationStore, dataSourceStore } from "stores"
import API from "./api"

/**
 * Executes a query against an external data connector.
 */
export const executeQuery = async ({ queryId, parameters }) => {
  const query = await fetchQueryDefinition(queryId)
  if (query?.datasourceId == null) {
    notificationStore.actions.error("That query couldn't be found")
    return
  }
  const res = await API.post({
    url: `/api/queries/${queryId}`,
    body: {
      parameters,
    },
  })
  if (res.error) {
    notificationStore.actions.error("An error has occurred")
  } else if (!query.readable) {
    notificationStore.actions.success("Query executed successfully")
    await dataSourceStore.actions.invalidateDataSource(query.datasourceId)
  }
  return res
}

/**
 * Fetches the definition of an external query.
 */
export const fetchQueryDefinition = async queryId => {
  return await API.get({ url: `/api/queries/${queryId}`, cache: true })
}
