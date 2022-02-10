<script>
  import { screenStore, routeStore } from "stores"
  import Component from "./Component.svelte"
  import Provider from "./context/Provider.svelte"
  import { onMount } from "svelte"

  // Keep route params up to date
  export let params = {}
  $: routeStore.actions.setRouteParams(params || {})

  // Get the screen definition for the current route
  $: screenDefinition = $screenStore.activeScreen?.props

  // Mark the router as loaded whenever the screen mounts
  onMount(() => {
    if (!$routeStore.routerLoaded) {
      routeStore.actions.setRouterLoaded()
    }
  })
</script>

<!-- Ensure to fully remount when screen changes -->
{#if $routeStore.routerLoaded}
  {#key screenDefinition?._id}
    <Provider key="url" data={params}>
      <Component isScreen instance={screenDefinition} />
    </Provider>
  {/key}
{/if}
