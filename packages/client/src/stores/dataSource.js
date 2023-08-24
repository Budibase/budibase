import { writable, get } from "svelte/store"
import { API } from "api"
import { FieldTypes } from "../constants"
import { routeStore } from "./routes"

export const createDataSourceStore = () => {
  const store = writable([])

  // Registers a new dataSource instance
  const registerDataSource = (dataSource, instanceId, refresh) => {
    if (!dataSource || !instanceId || !refresh) {
      return
    }

    // Extract the relevant datasource ID for this datasource
    let dataSourceId = null

    // Extract table ID
    if (dataSource.type === "table" || dataSource.type === "view") {
      dataSourceId = dataSource.tableId
    } else if (dataSource.type === "viewV2") {
      dataSourceId = dataSource.id
    }

    // Only one side of the relationship is required as a trigger, as it will
    // automatically invalidate related table IDs
    else if (dataSource.type === FieldTypes.LINK) {
      dataSourceId = dataSource.tableId || dataSource.rowTableId
    }

    // Extract the dataSource ID (not the query ID) for queries
    else if (dataSource.type === "query") {
      dataSourceId = dataSource.dataSourceId
    }

    // Store configs for each relevant dataSource ID
    if (dataSourceId) {
      store.update(state => {
        state.push({
          dataSourceId,
          instanceId,
          refresh,
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
  const invalidateDataSource = async (dataSourceId, options) => {
    if (!dataSourceId) {
      return
    }

    // Merge default options
    options = {
      invalidateRelationships: false,
      ...options,
    }

    // Emit this as a window event, so parent screens which are iframing us in
    // can also invalidate the same datasource
    const inModal = get(routeStore).queryParams?.peek
    if (inModal) {
      window.parent.postMessage({
        type: "invalidate-datasource",
        detail: { dataSourceId, options },
      })
    }

    let invalidations = [dataSourceId]

    // Fetch related table IDs from table schema
    let schema
    if (options.invalidateRelationships && !dataSourceId?.includes("view_")) {
      try {
        const definition = await API.fetchTableDefinition(dataSourceId)
        schema = definition?.schema
      } catch (error) {
        schema = null
      }
    }
    if (schema) {
      Object.values(schema).forEach(fieldSchema => {
        if (
          fieldSchema.type === FieldTypes.LINK &&
          fieldSchema.tableId &&
          !fieldSchema.autocolumn
        ) {
          invalidations.push(fieldSchema.tableId)
        }
      })
    }

    // Remove any dupes
    invalidations = [...new Set(invalidations)]

    // Invalidate all sources
    invalidations.forEach(id => {
      const relatedInstances = get(store).filter(instance => {
        return instance.dataSourceId === id
      })
      relatedInstances?.forEach(instance => {
        instance.refresh()
      })
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { registerDataSource, unregisterInstance, invalidateDataSource },
  }
}

export const dataSourceStore = createDataSourceStore()
