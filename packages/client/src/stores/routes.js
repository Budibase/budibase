import { get, writable } from "svelte/store"
import { push } from "svelte-spa-router"
import * as API from "../api"
import { peekStore } from "./peek"
import { builderStore } from "./builder"

const createRouteStore = () => {
  const initialState = {
    routes: [],
    routeParams: {},
    activeRoute: null,
    routeSessionId: Math.random(),
    routerLoaded: false,
    queryParams: {},
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
      state.routeSessionId = Math.random()
      return state
    })
  }
  const setRouteParams = routeParams => {
    store.update(state => {
      state.routeParams = routeParams
      return state
    })
  }
  const setQueryParams = queryParams => {
    store.update(state => {
      state.queryParams = {
        ...queryParams,
        // Never unset the peek param - screen peek modals should always be
        // in a peek state, even if they navigate to a different page
        peek: queryParams.peek || state.queryParams?.peek,
      }
      return state
    })
  }
  const setActiveRoute = route => {
    store.update(state => {
      state.activeRoute = state.routes.find(x => x.path === route)
      return state
    })
  }
  const navigate = (url, peek) => {
    if (get(builderStore).inBuilder) {
      return
    }
    if (url) {
      // If we're already peeking, don't peek again
      const isPeeking = get(store).queryParams?.peek
      if (peek && !isPeeking) {
        peekStore.actions.showPeek(url)
      } else {
        const external = !url.startsWith("/")
        if (external) {
          window.location.href = url
        } else {
          push(url)
        }
      }
    }
  }
  const setRouterLoaded = () => {
    store.update(state => ({ ...state, routerLoaded: true }))
  }

  return {
    subscribe: store.subscribe,
    actions: {
      fetchRoutes,
      navigate,
      setRouteParams,
      setQueryParams,
      setActiveRoute,
      setRouterLoaded,
    },
  }
}

export const routeStore = createRouteStore()
