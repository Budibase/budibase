import { writable } from "svelte/store"
import { push } from "svelte-spa-router"
import * as API from "../api"

const createRouteStore = () => {
  const initialState = {
    routes: [],
    routeParams: {},
    activeRoute: null,
  }
  const store = writable(initialState)

  const fetchRoutes = async () => {
    const routeConfig = await API.fetchRoutes()
    let routes = []
    Object.values(routeConfig.routes).forEach(route => {
      Object.entries(route.subpaths).forEach(([path, config]) => {
        routes.push({
          path,
          screenId: config.screenId,
        })
      })
    })

    // Sort route by paths so that the router matches correctly
    routes.sort((a, b) => {
      return a.path > b.path ? -1 : 1
    })

    store.update(state => {
      state.routes = routes
      return state
    })
  }
  const setRouteParams = routeParams => {
    store.update(state => {
      state.routeParams = routeParams
      return state
    })
  }
  const setActiveRoute = route => {
    store.update(state => {
      state.activeRoute = state.routes.find(x => x.path === route)
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
