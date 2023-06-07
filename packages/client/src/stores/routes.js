import { get, writable } from "svelte/store"
import { push } from "svelte-spa-router"
import { API } from "api"
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
    let routeConfig
    try {
      routeConfig = await API.fetchClientAppRoutes()
    } catch (error) {
      routeConfig = null
    }
    let routes = []
    Object.values(routeConfig?.routes || {}).forEach(route => {
      Object.entries(route.subpaths || {}).forEach(([path, config]) => {
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
  const navigate = (url, peek, externalNewTab) => {
    if (get(builderStore).inBuilder) {
      return
    }
    if (url) {
      // If we're already peeking, don't peek again
      const isPeeking = get(store).queryParams?.peek
      const external = !url.startsWith("/")
      if (peek && !isPeeking && !external) {
        peekStore.actions.showPeek(url)
      } else if (external) {
        if (url.startsWith("www")) {
          url = `https://${url}`
        }
        if (externalNewTab) {
          window.open(url, "_blank")
        } else {
          window.location.href = url
        }
      } else {
        push(url)
      }
    }
  }
  const setRouterLoaded = () => {
    store.update(state => ({ ...state, routerLoaded: true }))
  }
  const createFullURL = relativeURL => {
    if (!relativeURL?.startsWith("/")) {
      return relativeURL
    }
    if (!window.location.href.includes("#")) {
      return `${window.location.href}#${relativeURL}`
    }
    const base = window.location.href.split("#")[0]
    return `${base}#${relativeURL}`
  }

  return {
    subscribe: store.subscribe,
    actions: {
      fetchRoutes,
      navigate,
      createFullURL,
      setRouteParams,
      setQueryParams,
      setActiveRoute,
      setRouterLoaded,
    },
  }
}

export const routeStore = createRouteStore()
