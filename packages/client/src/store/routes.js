import { writable } from "svelte/store"
import { push } from "svelte-spa-router"

const createRouteStore = () => {
  const initialState = {
    routes: [],
    routeParams: {},
    activeRoute: null,
  }
  const store = writable(initialState)

  const fetchRoutes = () => {
    const frontendDefinition = window["##BUDIBASE_FRONTEND_DEFINITION##"]
    const routes = frontendDefinition.screens.map(screen => ({
      path: screen.route,
      screenId: screen._id,
    }))
    store.update(state => {
      state.routes = routes
      return state
    })
  }
  const setRouteParams = routeParams => {
    console.log("new route params: ")
    console.log(routeParams)
    store.update(state => {
      state.routeParams = routeParams
      return state
    })
  }
  const setActiveRoute = route => {
    store.update(state => {
      state.activeRoute = route
      return state
    })
  }
  const navigate = push

  return {
    subscribe: store.subscribe,
    actions: { fetchRoutes, navigate, setRouteParams, setActiveRoute },
  }
}

export const routeStore = createRouteStore()
