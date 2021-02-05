<script>
  import { writable } from "svelte/store"
  import { setContext, onMount } from "svelte"
  import Component from "./Component.svelte"
  import NotificationDisplay from "./NotificationDisplay.svelte"
  import Provider from "./Provider.svelte"
  import SDK from "../sdk"
  import {
    createContextStore,
    initialise,
    screenStore,
    authStore,
  } from "../store"

  // Provide contexts
  setContext("sdk", SDK)
  setContext("component", writable({}))
  setContext("context", createContextStore())

  let loaded = false

  // Load app config
  onMount(async () => {
    await initialise()
    await authStore.actions.fetchUser()
    loaded = true
  })
</script>

{#if loaded && $screenStore.activeLayout}
  <Provider key="user" data={$authStore}>
    <Component definition={$screenStore.activeLayout.props} />
    <NotificationDisplay />
  </Provider>
{/if}
