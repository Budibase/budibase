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
    routeStore,
    builderStore,
  } from "../store"
  import { TableNames, ActionTypes } from "../constants"
  import SettingsBar from "./preview/SettingsBar.svelte"
  import SelectionIndicator from "./preview/SelectionIndicator.svelte"
  import HoverIndicator from "./preview/HoverIndicator.svelte"

  // Provide contexts
  setContext("sdk", SDK)
  setContext("component", writable({}))
  setContext("context", createContextStore())

  let dataLoaded = false

  // Load app config
  onMount(async () => {
    await initialise()
    await authStore.actions.fetchUser()
    dataLoaded = true
  })

  // Register this as a refreshable datasource so that user changes cause
  // the user object to be refreshed
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => authStore.actions.fetchUser(),
      metadata: { dataSource: { type: "table", tableId: TableNames.USERS } },
    },
  ]

  // Redirect to home layout if no matching route
  $: {
    if (dataLoaded && $routeStore.routerLoaded && !$routeStore.activeRoute) {
      if ($authStore) {
        routeStore.actions.navigate("/")
      } else {
        const returnUrl = `${window.location.pathname}${window.location.hash}`
        const encodedUrl = encodeURIComponent(returnUrl)
        window.location = `/builder/auth/login?returnUrl=${encodedUrl}`
      }
    }
  }
</script>

{#if dataLoaded && $screenStore.activeLayout}
  <div
    id="spectrum-root"
    lang="en"
    dir="ltr"
    class="spectrum spectrum--medium spectrum--light"
  >
    <Provider key="user" data={$authStore} {actions}>
      <div id="app-root">
        <Component definition={$screenStore.activeLayout.props} />
      </div>
      <NotificationDisplay />
      <!-- Key block needs to be outside the if statement or it breaks -->
      {#key $builderStore.selectedComponentId}
        {#if $builderStore.inBuilder}
          <SettingsBar />
        {/if}
      {/key}
      <!--
        We don't want to key these by componentID as they control their own
        re-mounting to avoid flashes.
      -->
      {#if $builderStore.inBuilder}
        <SelectionIndicator />
        <HoverIndicator />
      {/if}
    </Provider>
  </div>
{/if}

<style>
  #spectrum-root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  #app-root {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
  }
</style>
