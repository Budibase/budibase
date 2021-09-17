<script>
  import { setContext, getContext } from "svelte"
  import Router, { querystring } from "svelte-spa-router"
  import { routeStore } from "stores"
  import Screen from "./Screen.svelte"

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
  $: {
    let queryParams = {}
    if ($querystring) {
      const urlSearchParams = new URLSearchParams($querystring)
      for (const [key, value] of urlSearchParams) {
        queryParams[key] = value
      }
    }
    routeStore.actions.setQueryParams(queryParams)
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
    routeStore.actions.setActiveRoute(detail.route)
  }
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
