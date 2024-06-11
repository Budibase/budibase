<script>
  import { setContext, getContext, onMount } from "svelte"
  import Router, { querystring } from "svelte-spa-router"
  import { routeStore, stateStore } from "stores"
  import Screen from "./Screen.svelte"
  import { get } from "svelte/store"
  import { Modal, ModalContent } from "@budibase/bbui"
  import NOP from "./NOP.svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  setContext("screenslot", true)

  let listenerRegistered = false
  let currentHash = location.hash
  let nextHash = location.hash
  let navigationConfirmationModal

  // Only wrap this as an array to take advantage of svelte keying,
  // to ensure the svelte-spa-router is fully remounted when route config
  // changes
  $: config = getRouterConfig($routeStore.routes)
  $: routerKey = $routeStore.routeSessionId

  // Keep query params up to date
  $: routeStore.actions.setQueryParams(parseQueryString($querystring))

  const parseQueryString = query => {
    let queryParams = {}
    if (query) {
      const urlSearchParams = new URLSearchParams(query)
      for (const [key, value] of urlSearchParams) {
        queryParams[key] = value
      }
    }
    return queryParams
  }

  const getRouterConfig = routes => {
    let config = {}
    routes.forEach(route => {
      config[route.path] = NOP
    })
    return config
  }

  const onRouteLoading = ({ detail }) => {
    // Don't update routing state if we require confirmation
    if ($routeStore.confirmNavigation) {
      return
    }
    routeStore.actions.setRouteParams(detail.params || {})
    routeStore.actions.setActiveRoute(detail.route)
  }

  const handleHashChange = () => {
    if ($routeStore.confirmNavigation) {
      // Skip if same hash (triggered by ourselves)
      if (currentHash === location.hash) {
        return
      }

      // Store the next desired hash
      nextHash = location.hash

      // Prevent this navigaiton by restoring the hash to the one we're about
      // to leave
      location.hash = currentHash

      // Prompt user
      navigationConfirmationModal.show()
    } else {
      currentHash = location.hash
    }
  }

  const confirmNavigation = () => {
    routeStore.actions.requireNavigationConfirmation(false)
    currentHash = nextHash
    location.hash = nextHash
    nextHash = location.currentHash
  }

  onMount(() => {
    // Register listener to intercept hashchange events so we can block routing
    window.addEventListener("hashchange", handleHashChange)
    listenerRegistered = true

    // Initialise state store from query string on initial load
    const queryParams = parseQueryString(get(querystring))
    if (queryParams.state) {
      try {
        const state = JSON.parse(atob(queryParams.state))
        stateStore.actions.initialise(state)
      } catch (error) {
        // Swallow error and do nothing
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  })
</script>

{#if listenerRegistered}
  <div use:styleable={$component.styles}>
    <Screen />
  </div>

  {#key routerKey}
    <div class="hidden">
      <Router on:routeLoading={onRouteLoading} routes={config} />
    </div>
  {/key}
{/if}

<Modal bind:this={navigationConfirmationModal}>
  <ModalContent confirmText="Yes" cancelText="No" onConfirm={confirmNavigation}>
    Are you sure you want to leave this page? Unsaved work will be lost.
  </ModalContent>
</Modal>

<style>
  div {
    position: relative;
  }
  div.hidden {
    display: none;
  }
</style>
