import { writable, get } from "svelte/store"
import { notificationStore } from "./notification"

export const createDataSourceStore = () => {
  const store = writable([])

  // Registers a new dataSource instance
  const registerDataSource = (dataSource, instanceId, refresh) => {
    if (!dataSource || !instanceId || !refresh) {
      return
    }

    // Create a list of all relevant dataSource IDs which would require that
    // this dataSource is refreshed
    let dataSourceIds = []

    // Extract table ID
    if (dataSource.type === "table" || dataSource.type === "view") {
      if (dataSource.tableId) {
        dataSourceIds.push(dataSource.tableId)
      }
    }

    // Extract both table IDs from both sides of the relationship
    else if (dataSource.type === "link") {
      if (dataSource.rowTableId) {
        dataSourceIds.push(dataSource.rowTableId)
      }
      if (dataSource.tableId) {
        dataSourceIds.push(dataSource.tableId)
      }
    }

    // Extract the dataSource ID (not the query ID) for queries
    else if (dataSource.type === "query") {
      if (dataSource.dataSourceId) {
        dataSourceIds.push(dataSource.dataSourceId)
      }
    }

    // Store configs for each relevant dataSource ID
    if (dataSourceIds.length) {
      store.update(state => {
        dataSourceIds.forEach(id => {
          state.push({
            dataSourceId: id,
            instanceId,
            refresh,
          })
        })
        return state
      })
    }
  }

  // Removes all registered dataSource instances belonging to a particular
  // instance ID
  const unregisterInstance = instanceId => {
    store.update(state => {
      return state.filter(instance => instance.instanceId !== instanceId)
    })
  }

  // Invalidates a specific dataSource ID by refreshing all instances
  // which depend on data from that dataSource
  const invalidateDataSource = dataSourceId => {
    const relatedInstances = get(store).filter(instance => {
      return instance.dataSourceId === dataSourceId
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
    actions: { registerDataSource, unregisterInstance, invalidateDataSource },
  }
}

export const dataSourceStore = createDataSourceStore()
