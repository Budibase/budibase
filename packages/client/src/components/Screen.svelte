<script>
  import { screenStore, routeStore, builderStore } from "stores"
  import { get } from "svelte/store"
  import Component from "./Component.svelte"
  import Provider from "./context/Provider.svelte"
  import { onMount, getContext } from "svelte"
  import { enrichButtonActions } from "../utils/buttonActions.js"
  import { memo } from "@budibase/frontend-core"

  export let params = {}

  const context = getContext("context")
  const onLoadActions = memo()

  // Get the screen definition for the current route
  $: screen = $screenStore.activeScreen
  $: onLoadActions.set(screen?.onLoad)
  $: runOnLoadActions($onLoadActions, params)

  // Enrich and execute any on load actions.
  // We manually construct the full context here as this component is the
  // one that provides the url context, so it is not available in $context yet
  const runOnLoadActions = (actions, params) => {
    if (actions?.length && !get(builderStore).inBuilder) {
      const enrichedActions = enrichButtonActions(actions, {
        ...get(context),
        url: params,
      })
      if (enrichedActions != null) {
        enrichedActions()
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
{#if $routeStore.routerLoaded && screen?.props}
  {#key screen.props._id}
    <Provider key="url" data={params}>
      <Component isRoot instance={screen.props} />
    </Provider>
  {/key}
{/if}
