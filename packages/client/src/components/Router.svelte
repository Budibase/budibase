<script>
  import { setContext, getContext, onMount } from "svelte"
  import Router, { querystring } from "svelte-spa-router"
  import { routeStore, stateStore } from "stores"
  import Screen from "./Screen.svelte"
  import { get } from "svelte/store"

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  setContext("screenslot", true)

  // Only wrap this as an array to take advantage of svelte keying,
  // to ensure the svelte-spa-router is fully remounted when route config
  // changes
  $: config = {
    routes: getRouterConfig($routeStore.routes),
    id: $routeStore.routeSessionId,
  }

  // Keep query params up to date
  $: routeStore.actions.setQueryParams(parseQueryString($querystring))

  const parseQueryString = query => {
    let queryParams = {}
    if (query) {
      const urlSearchParams = new URLSearchParams(query)
      for (const [key, value] of urlSearchParams) {
        queryParams[key] = value
      }
    }
    return queryParams
  }

  const getRouterConfig = routes => {
    let config = {}
    routes.forEach(route => {
      config[route.path] = Screen
    })

    // Add catch-all route so that we serve the Screen component always
    config["*"] = Screen
    return config
  }

  const onRouteLoading = ({ detail }) => {
    routeStore.actions.setRouteParams(detail.params || {})
    routeStore.actions.setActiveRoute(detail.route)
  }

  // Initialise state store from query string on initial load
  onMount(() => {
    const queryParams = parseQueryString(get(querystring))
    if (queryParams.state) {
      try {
        const state = JSON.parse(atob(queryParams.state))
        stateStore.actions.initialise(state)
      } catch (error) {
        // Swallow error and do nothing
      }
    }
  })
</script>

{#key config.id}
  <div use:styleable={$component.styles}>
    <Router on:routeLoading={onRouteLoading} routes={config.routes} />
  </div>
{/key}

<style>
  div {
    position: relative;
  }
</style>
