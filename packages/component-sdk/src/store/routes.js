import { writable } from "svelte/store"
import { push } from "svelte-spa-router"

const initialState = []

export const createRouteStore = () => {
  const store = writable(initialState)

  const fetchRoutes = () => {
    const frontendDefinition = window["##BUDIBASE_FRONTEND_DEFINITION##"]
    const routes = frontendDefinition.screens.map(screen => ({
      path: screen.route,
      screenId: screen._id,
    }))
    store.set(routes)
  }
  const navigate = push
  store.actions = { fetchRoutes, navigate }

  return store
}
