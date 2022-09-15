<script>
  import { screenStore, routeStore, builderStore } from "stores"
  import Component from "./Component.svelte"
  import Provider from "./context/Provider.svelte"
  import { onMount, getContext } from "svelte"
  import { enrichButtonActions } from "../utils/buttonActions.js"

  export let params = {}

  const context = getContext("context")

  // Keep route params up to date
  $: routeStore.actions.setRouteParams(params || {})

  // Get the screen definition for the current route
  $: screenDefinition = $screenStore.activeScreen?.props

  onMount(() => {
    // Mark the router as loaded whenever the screen mounts
    if (!$routeStore.routerLoaded) {
      routeStore.actions.setRouterLoaded()
    }

    // Enrich and execute and on load actions.
    // We manually construct the full context here as this component is the
    // one that provides the url context, so it is not available in $context yet
    if ($screenStore.activeScreen?.onLoad && !$builderStore.inBuilder) {
      const actions = enrichButtonActions($screenStore.activeScreen.onLoad, {
        ...$context,
        url: params,
      })
      if (actions != null) {
        actions()
      }
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
