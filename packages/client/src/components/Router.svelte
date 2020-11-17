<script>
  import { onMount, setContext } from "svelte"
  import Router from "svelte-spa-router"
  import { routeStore, screenStore, styleable } from "@budibase/component-sdk"
  import Screen from "./Screen.svelte"

  export let styles
  let routes

  onMount(() => {
    initialiseRouter()
  })

  const initialiseRouter = async () => {
    await routeStore.actions.fetchRoutes()
    await screenStore.actions.fetchScreens()
    routes = {}
    $routeStore.routes.forEach(route => {
      routes[route.path] = Screen
    })

    // Add catch-all route so that we serve the Screen component always
    routes["*"] = Screen
  }

  function onRouteLoading({ detail }) {
    routeStore.actions.setActiveRoute(detail.route)
  }

  setContext("test", 123)
</script>

{#if routes}
  <div use:styleable={styles}>
    <Router on:routeLoading={onRouteLoading} {routes} />
  </div>
{/if}
