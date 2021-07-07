<script>
  import { writable } from "svelte/store"
  import { setContext, onMount } from "svelte"
  import Component from "./Component.svelte"
  import NotificationDisplay from "./NotificationDisplay.svelte"
  import ConfirmationDisplay from "./ConfirmationDisplay.svelte"
  import Provider from "./Provider.svelte"
  import SDK from "../sdk"
  import {
    createContextStore,
    initialise,
    screenStore,
    authStore,
    routeStore,
    builderStore,
    appStore,
  } from "../store"
  import { TableNames, ActionTypes } from "../constants"
  import SettingsBar from "./preview/SettingsBar.svelte"
  import SelectionIndicator from "./preview/SelectionIndicator.svelte"
  import HoverIndicator from "./preview/HoverIndicator.svelte"
  import { Layout, Heading, Body } from "@budibase/bbui"
  import ErrorSVG from "../../../builder/assets/error.svg"

  // Provide contexts
  setContext("sdk", SDK)
  setContext("component", writable({}))
  setContext("context", createContextStore())

  let dataLoaded = false
  let permissionError = false

  // Load app config
  onMount(async () => {
    await initialise()
    await authStore.actions.fetchUser()
    dataLoaded = true
    if ($builderStore.inBuilder) {
      builderStore.actions.notifyLoaded()
    }
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

  // Handle no matching route - this is likely a permission error
  $: {
    if (dataLoaded && $routeStore.routerLoaded && !$routeStore.activeRoute) {
      if ($authStore) {
        // There is a logged in user, so handle them
        if ($screenStore.screens.length) {
          // Screens exist so navigate back to the home screen
          const firstRoute = $screenStore.screens[0].routing?.route ?? "/"
          routeStore.actions.navigate(firstRoute)
        } else {
          // No screens likely means the user has no permissions to view this app
          permissionError = true
        }
      } else {
        // The user is not logged in, redirect them to login
        const returnUrl = `${window.location.pathname}${window.location.hash}`
        const encodedUrl = encodeURIComponent(returnUrl)
        window.location = `/builder/auth/login?returnUrl=${encodedUrl}`
      }
    }
  }

  $: themeClass =
    $builderStore.theme || $appStore.application?.theme || "spectrum--light"
</script>

{#if dataLoaded}
  <div
    id="spectrum-root"
    lang="en"
    dir="ltr"
    class="spectrum spectrum--medium {themeClass}"
  >
    {#if permissionError}
      <div class="error">
        <Layout justifyItems="center" gap="S">
          {@html ErrorSVG}
          <Heading size="L">You don't have permission to use this app</Heading>
          <Body size="S">Ask your administrator to grant you access</Body>
        </Layout>
      </div>
    {:else if $screenStore.activeLayout}
      <Provider key="user" data={$authStore} {actions}>
        <div id="app-root">
          {#key $screenStore.activeLayout._id}
            <Component instance={$screenStore.activeLayout.props} />
          {/key}
        </div>
        <NotificationDisplay />
        <ConfirmationDisplay />
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
    {/if}
  </div>
{/if}

<style>
  #spectrum-root,
  #app-root {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  #app-root {
    position: relative;
    border: 1px solid var(--spectrum-global-color-gray-300);
  }

  /* Custom scrollbars */
  :global(::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
  }
  :global(::-webkit-scrollbar-track) {
    background: var(--spectrum-alias-background-color-default);
  }
  :global(::-webkit-scrollbar-thumb) {
    background-color: var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }
  :global(::-webkit-scrollbar-corner) {
    background: var(--spectrum-alias-background-color-default);
  }
  :global(*) {
    scrollbar-width: thin;
    scrollbar-color: var(--spectrum-global-color-gray-400)
      var(--spectrum-alias-background-color-default);
  }

  .error {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: 1;
    text-align: center;
    padding: 20px;
  }
  .error :global(svg) {
    fill: var(--spectrum-global-color-gray-500);
    width: 80px;
    height: 80px;
  }
  .error :global(h1),
  .error :global(p) {
    color: var(--spectrum-global-color-gray-800);
  }
  .error :global(p) {
    font-style: italic;
    margin-top: -0.5em;
  }
  .error :global(h1) {
    font-weight: 400;
  }
</style>
