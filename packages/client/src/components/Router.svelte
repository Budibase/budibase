<script>
  import { onMount } from "svelte"
  import Router from "svelte-spa-router"
  import { routeStore, screenStore } from "@budibase/component-sdk"
  import Screen from "./Screen.svelte"

  let routes

  onMount(() => {
    initialiseRouter()
  })

  const initialiseRouter = async () => {
    await routeStore.actions.fetchRoutes()
    await screenStore.actions.fetchScreens()
    routes = {}
    $routeStore.forEach(route => {
      routes[route.path] = Screen
    })
  }

  function test(a, b) {
    console.log(a)
    console.log(b)
  }
</script>

{#if routes}
  <Router {routes} on:routeEvent={test} />
{/if}
