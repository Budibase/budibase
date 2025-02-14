import { get, writable } from "svelte/store"
import { push } from "svelte-spa-router"
import { API } from "@/api"
import { peekStore } from "./peek"
import { builderStore } from "./builder"

interface Route {
  path: string
  screenId: string
}

interface StoreType {
  routes: Route[]
  routeParams: {}
  activeRoute?: Route | null
  routeSessionId: number
  routerLoaded: boolean
  queryParams?: {
    peek?: boolean
  }
}

const createRouteStore = () => {
  const initialState: StoreType = {
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
    const routes: Route[] = []
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
  const setRouteParams = (routeParams: StoreType["routeParams"]) => {
    store.update(state => {
      state.routeParams = routeParams
      return state
    })
  }
  const setQueryParams = (queryParams: { peek?: boolean }) => {
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
  const setActiveRoute = (route: string) => {
    store.update(state => {
      state.activeRoute = state.routes.find(x => x.path === route)
      return state
    })
  }
  const navigate = (url: string, peek: boolean, externalNewTab: boolean) => {
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
  const createFullURL = (relativeURL: string) => {
    if (!relativeURL?.startsWith("/")) {
      return relativeURL
    }
    if (!window.location.href.includes("#")) {
      return `${window.location.href}#${relativeURL}`
    }
    const base = window.location.href.split("#")[0]
    return `${base}#${relativeURL}`
  }
  const setTestUrlParams = (route: string, testValue: string) => {
    if (route === "/") {
      return
    }

    const [pathPart, queryPart] = testValue.split("?")
    const routeSegments = route.split("/").filter(Boolean)

    // If first segment happens to be a parameter (e.g. /:foo), include it
    const startIndex = routeSegments[0]?.startsWith(":") ? 0 : 1
    const segments = routeSegments.slice(startIndex)
    const testSegments = pathPart.split("/")

    const params: Record<string, string> = {}
    segments.forEach((segment, index) => {
      if (segment.startsWith(":") && index < testSegments.length) {
        params[segment.slice(1)] = testSegments[index]
      }
    })

    const queryParams: Record<string, string> = {}
    if (queryPart) {
      queryPart.split("&").forEach(param => {
        const [key, value] = param.split("=")
        if (key && value) {
          queryParams[key] = value
        }
      })
    }

    setQueryParams({ ...queryParams })
    store.update(state => ({ ...state, testUrlParams: params }))
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
      setTestUrlParams,
    },
  }
}

export const routeStore = createRouteStore()
