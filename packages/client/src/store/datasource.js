import { writable, get } from "svelte/store"
import { notificationStore } from "./notification"

export const createDatasourceStore = () => {
  const store = writable([])

  // Registers a new datasource instance
  const registerDatasource = (datasource, instanceId, refresh) => {
    if (!datasource || !instanceId || !refresh) {
      return
    }

    // Create a list of all relevant datasource IDs which would require that
    // this datasource is refreshed
    let datasourceIds = []

    // Extract table ID
    if (datasource.type === "table" || datasource.type === "view") {
      if (datasource.tableId) {
        datasourceIds.push(datasource.tableId)
      }
    }

    // Extract both table IDs from both sides of the relationship
    else if (datasource.type === "link") {
      if (datasource.rowTableId) {
        datasourceIds.push(datasource.rowTableId)
      }
      if (datasource.tableId) {
        datasourceIds.push(datasource.tableId)
      }
    }

    // Extract the datasource ID (not the query ID) for queries
    else if (datasource.type === "query") {
      if (datasource.datasourceId) {
        datasourceIds.push(datasource.datasourceId)
      }
    }

    // Store configs for each relevant datasource ID
    if (datasourceIds.length) {
      store.update(state => {
        datasourceIds.forEach(id => {
          state.push({
            datasourceId: id,
            instanceId,
            refresh,
          })
        })
        return state
      })
    }
  }

  // Removes all registered datasource instances belonging to a particular
  // instance ID
  const unregisterInstance = instanceId => {
    store.update(state => {
      return state.filter(instance => instance.instanceId !== instanceId)
    })
  }

  // Invalidates a specific datasource ID by refreshing all instances
  // which depend on data from that datasource
  const invalidateDatasource = datasourceId => {
    const relatedInstances = get(store).filter(instance => {
      return instance.datasourceId === datasourceId
    })
    if (relatedInstances?.length) {
      notificationStore.blockNotifications(1000)
    }
    relatedInstances?.forEach(instance => {
      instance.refresh()
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { registerDatasource, unregisterInstance, invalidateDatasource },
  }
}

export const datasourceStore = createDatasourceStore()
