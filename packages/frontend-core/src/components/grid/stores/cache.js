export const createActions = context => {
  const { API } = context

  // Cache for the primary display columns of different tables.
  // If we ever need to cache table definitions for other purposes then we can
  // expand this to be a more generic cache.
  let primaryDisplayCache = {}

  const resetPrimaryDisplayCache = () => {
    primaryDisplayCache = {}
  }

  const getPrimaryDisplayForTableId = async tableId => {
    // If we've never encountered this tableId before then store a promise that
    // resolves to the primary display so that subsequent invocations before the
    // promise completes can reuse this promise
    if (!primaryDisplayCache[tableId]) {
      primaryDisplayCache[tableId] = new Promise(resolve => {
        API.fetchTableDefinition(tableId).then(def => {
          const display = def?.primaryDisplay || def?.schema?.[0]?.name
          primaryDisplayCache[tableId] = display
          resolve(display)
        })
      })
    }

    // We await the result so that we account for both promises and primitives
    return await primaryDisplayCache[tableId]
  }

  return {
    cache: {
      actions: {
        getPrimaryDisplayForTableId,
        resetPrimaryDisplayCache,
      },
    },
  }
}

export const initialise = context => {
  const { datasource, cache } = context

  // Wipe the caches whenever the datasource changes to ensure we aren't
  // storing any stale information
  datasource.subscribe(cache.actions.resetPrimaryDisplayCache)
}
