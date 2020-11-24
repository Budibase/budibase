<script>
  import { setContext, onMount } from "svelte"
  import Component from "./Component.svelte"
  import SDK from "../sdk"
  import { routeStore, screenStore, createDataStore } from "../store"

  // Provide contexts
  setContext("sdk", SDK)
  setContext("data", createDataStore())

  let loaded = false

  // Load app config
  onMount(async () => {
    await routeStore.actions.fetchRoutes()
    await screenStore.actions.fetchScreens()
    loaded = true
  })
</script>

{#if loaded}
  <Component definition={$screenStore.page.props} />
{/if}
