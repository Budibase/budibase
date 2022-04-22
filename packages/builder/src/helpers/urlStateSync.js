import { get } from "svelte/store"

export const syncURLToState = options => {
  const { keys, params, store, goto } = options || {}
  if (
    !keys?.length ||
    !params?.subscribe ||
    !store?.subscribe ||
    !goto?.subscribe
  ) {
    return
  }

  // We can't dynamically fetch the value of routify stores so we need to
  // just subscribe and cache the latest versions.
  // We can grab their initial values as this is during component
  // initialisation.
  let cachedParams = get(params)
  let cachedGoto = get(goto)

  // Updates state with new URL params
  const mapUrlToState = params => {
    // Determine any required state updates
    let stateUpdates = []
    const state = get(store)
    for (let key of keys) {
      const urlValue = params?.[key.url]
      const stateValue = state?.[key.state]
      if (urlValue !== stateValue) {
        console.log(
          `state.${key.state} (${stateValue}) <= url.${key.url} (${urlValue})`
        )
        stateUpdates.push(state => {
          state[key.state] = urlValue
        })
      }
    }

    // Avoid updating the store at all if not necessary to prevent a wasted
    // store invalidation
    if (!stateUpdates.length) {
      return
    }

    // Apply the required state updates
    console.log("Performing", stateUpdates.length, "state updates")
    store.update(state => {
      for (let update of stateUpdates) {
        update(state)
      }
      return state
    })
  }

  // Updates the URL with new state values
  const mapStateToUrl = state => {
    // Determine new URL while checking for changes
    let url = ".."
    let needsUpdate = false
    for (let key of keys) {
      const urlValue = cachedParams?.[key.url]
      const stateValue = state?.[key.state]
      url += `/${stateValue}`
      if (stateValue !== urlValue) {
        console.log(
          `url.${key.url} (${urlValue}) <= state.${key.state} (${stateValue})`
        )
        needsUpdate = true
      }
    }

    // Avoid updating the URL if not necessary to prevent a wasted render
    // cycle
    if (!needsUpdate) {
      return
    }

    // Navigate to the new URL
    console.log("Navigating to", url)
    cachedGoto(url)
  }

  // Initially hydrate state from URL
  mapUrlToState(cachedParams)

  // Subscribe to URL changes and cache them
  const unsubscribeParams = params.subscribe($urlParams => {
    cachedParams = $urlParams
    mapUrlToState($urlParams)
  })

  // Subscribe to goto changes and cache them
  const unsubscribeGoto = goto.subscribe($goto => {
    cachedGoto = $goto
  })

  // Subscribe to store changes and keep URL up to date
  const unsubscribeStore = store.subscribe(mapStateToUrl)

  // Return an unsync function to cancel subscriptions
  return () => {
    unsubscribeParams()
    unsubscribeGoto()
    unsubscribeStore()
  }
}
