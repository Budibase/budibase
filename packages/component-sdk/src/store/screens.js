import { writable, derived, get } from "svelte/store"

const initialState = []

export const createScreenStore = () => {
  const store = writable(initialState)
  const routeLookupMap = derived(store, $screens => {
    let map = {}
    $screens.forEach(screen => {
      map[screen.route] = screen
    })
    return map
  })

  const fetchScreens = () => {
    const frontendDefinition = window["##BUDIBASE_FRONTEND_DEFINITION##"]
    store.set(frontendDefinition.screens)
  }
  const getScreenByRoute = path => {
    return get(routeLookupMap)[path]
  }
  store.actions = { fetchScreens, getScreenByRoute }

  return store
}
