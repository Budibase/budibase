<script>
  import { onMount } from "svelte"
  import Router from "svelte-spa-router"
  import { routeStore, screenStore } from "../store"
  import Screen from "./Screen.svelte"
  import { styleable } from "../utils"

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
</script>

{#if routes}
  <div use:styleable={styles}>
    <Router on:routeLoading={onRouteLoading} {routes} />
  </div>
{/if}
