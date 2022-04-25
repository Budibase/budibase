import { get } from "svelte/store"
import { isChangingPage } from "@roxi/routify"

export const syncURLToState = options => {
  const { keys, params, store, goto, redirect, baseUrl = "." } = options || {}
  if (
    !keys?.length ||
    !params?.subscribe ||
    !store?.subscribe ||
    !goto?.subscribe ||
    !redirect?.subscribe
  ) {
    console.warn("syncURLToState invoked with missing parameters")
    return
  }

  // We can't dynamically fetch the value of stateful routify stores so we need
  // to just subscribe and cache the latest versions.
  // We can grab their initial values as this is during component
  // initialisation.
  let cachedParams = get(params)
  let cachedGoto = get(goto)
  let cachedRedirect = get(redirect)
  let hydrated = false
  let debug = false
  const log = (...params) => debug && console.log(...params)

  // Navigate to a certain URL
  const gotoUrl = url => {
    if (get(isChangingPage) && hydrated) {
      return
    }
    log("Navigating to", url)
    cachedGoto(url)
  }

  // Redirect to a certain URL
  const redirectUrl = url => {
    if (get(isChangingPage) && hydrated) {
      return
    }
    log("Redirecting to", url)
    cachedRedirect(url)
  }

  // Updates state with new URL params
  const mapUrlToState = params => {
    // Determine any required state updates
    let stateUpdates = []
    const state = get(store)
    for (let key of keys) {
      const urlValue = params?.[key.url]
      const stateValue = state?.[key.state]
      if (urlValue && urlValue !== stateValue) {
        log(
          `state.${key.state} (${stateValue}) <= url.${key.url} (${urlValue})`
        )
        stateUpdates.push(state => {
          state[key.state] = urlValue
        })
        if (key.validate && key.fallbackUrl) {
          if (!key.validate(urlValue)) {
            log("Invalid URL param!")
            redirectUrl(key.fallbackUrl)
            hydrated = true
            return
          }
        }
      }
    }

    // Mark our initial hydration as completed
    hydrated = true

    // Avoid updating the store at all if not necessary to prevent a wasted
    // store invalidation
    if (!stateUpdates.length) {
      return
    }

    // Apply the required state updates
    log("Performing", stateUpdates.length, "state updates")
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
    let url = baseUrl
    let needsUpdate = false
    for (let key of keys) {
      const urlValue = cachedParams?.[key.url]
      const stateValue = state?.[key.state]
      url += `/${stateValue}`
      if (stateValue !== urlValue) {
        needsUpdate = true
        log(
          `url.${key.url} (${urlValue}) <= state.${key.state} (${stateValue})`
        )
        if (key.validate && key.fallbackUrl) {
          if (!key.validate(stateValue)) {
            log("Invalid state param!")
            redirectUrl(key.fallbackUrl)
            return
          }
        }
      }
    }

    // Avoid updating the URL if not necessary to prevent a wasted render
    // cycle
    if (!needsUpdate) {
      return
    }

    // Navigate to the new URL
    if (!get(isChangingPage)) {
      gotoUrl(url)
    }
  }

  // Initially hydrate state from URL
  mapUrlToState(cachedParams)

  // Subscribe to URL changes and cache them
  const unsubscribeParams = params.subscribe($urlParams => {
    cachedParams = $urlParams
    mapUrlToState($urlParams)
  })

  // Subscribe to routify store changes and cache them
  const unsubscribeGoto = goto.subscribe($goto => {
    cachedGoto = $goto
  })
  const unsubscribeRedirect = redirect.subscribe($redirect => {
    cachedRedirect = $redirect
  })

  // Subscribe to store changes and keep URL up to date
  const unsubscribeStore = store.subscribe(mapStateToUrl)

  // Return an unsync function to cancel subscriptions
  return () => {
    unsubscribeParams()
    unsubscribeGoto()
    unsubscribeRedirect()
    unsubscribeStore()
  }
}
