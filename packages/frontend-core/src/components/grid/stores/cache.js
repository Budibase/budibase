export const createActions = context => {
  const { API } = context

  // Cache for the primary display columns of different tables.
  // If we ever need to cache table definitions for other purposes then we can
  // expand this to be a more generic cache.
  let tableCache = {}

  const resetCache = () => {
    tableCache = {}
  }

  const fetchTable = async tableId => {
    // If we've never encountered this tableId before then store a promise that
    // resolves to the primary display so that subsequent invocations before the
    // promise completes can reuse this promise
    if (!tableCache[tableId]) {
      tableCache[tableId] = API.fetchTableDefinition(tableId)
    }
    // We await the result so that we account for both promises and primitives
    return await tableCache[tableId]
  }

  const getPrimaryDisplayForTableId = async tableId => {
    const table = await fetchTable(tableId)
    const display = table?.primaryDisplay || table?.schema?.[0]?.name
    return display
  }

  const getTable = async tableId => {
    const table = await fetchTable(tableId)
    return table
  }

  return {
    cache: {
      actions: {
        getPrimaryDisplayForTableId,
        getTable,
        resetCache,
      },
    },
  }
}

export const initialise = context => {
  const { datasource, cache } = context

  // Wipe the caches whenever the datasource changes to ensure we aren't
  // storing any stale information
  datasource.subscribe(cache.actions.resetCache)
}
