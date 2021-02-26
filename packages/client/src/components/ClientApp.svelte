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
  import { TableNames, ActionTypes } from "../constants"

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

  // Register this as a refreshable datasource so that user changes cause
  // the user object to be refreshed
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => authStore.actions.fetchUser(),
      metadata: { datasource: { type: "table", tableId: TableNames.USERS } },
    },
  ]
</script>

{#if loaded && $screenStore.activeLayout}
  <Provider key="user" data={$authStore} {actions}>
    <Component definition={$screenStore.activeLayout.props} />
    <NotificationDisplay />
  </Provider>
{/if}
