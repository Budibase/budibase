<script>
  import { writable } from "svelte/store"
  import { setContext, onMount } from "svelte"
  import Component from "./Component.svelte"
  import SDK from "../sdk"
  import { createDataStore, routeStore, screenStore } from "../store"

  // Provide contexts
  setContext("sdk", SDK)
  setContext("component", writable({}))
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
