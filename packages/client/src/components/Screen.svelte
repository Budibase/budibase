<script>
  import { screenStore, routeStore, builderStore } from "stores"
  import { get } from "svelte/store"
  import Component from "./Component.svelte"
  import Provider from "./context/Provider.svelte"
  import { onMount, getContext } from "svelte"
  import { enrichButtonActions } from "../utils/buttonActions.js"

  export let params = {}

  const context = getContext("context")

  // Get the screen definition for the current route
  $: screenDefinition = $screenStore.activeScreen?.props

  $: runOnLoadActions(params)

  // Enrich and execute any on load actions.
  // We manually construct the full context here as this component is the
  // one that provides the url context, so it is not available in $context yet
  const runOnLoadActions = params => {
    const screenState = get(screenStore)

    if (screenState.activeScreen?.onLoad && !get(builderStore).inBuilder) {
      const actions = enrichButtonActions(screenState.activeScreen.onLoad, {
        ...get(context),
        url: params,
      })
      if (actions != null) {
        actions()
      }
    }
  }

  onMount(() => {
    // Mark the router as loaded whenever the screen mounts
    if (!$routeStore.routerLoaded) {
      routeStore.actions.setRouterLoaded()
    }
  })
</script>

<!-- Ensure to fully remount when screen changes -->
{#if $routeStore.routerLoaded}
  {#key screenDefinition?._id}
    <Provider key="url" data={params}>
      <Component isRoot instance={screenDefinition} />
    </Provider>
  {/key}
{/if}
