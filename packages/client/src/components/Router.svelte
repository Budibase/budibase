<script>
  import { onMount } from "svelte"
  import Router from "svelte-spa-router"
  import { routeStore, screenStore } from "../store"
  import Screen from "./Screen.svelte"
  import { styleable } from "../utils"

  export let styles
  $: routerConfig = getRouterConfig($routeStore.routes)

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

{#if routerConfig}
  <div use:styleable={styles}>
    <Router on:routeLoading={onRouteLoading} routes={routerConfig} />
  </div>
{/if}
