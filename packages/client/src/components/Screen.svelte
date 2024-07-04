<script>
import { memo } from "@budibase/frontend-core"
import { builderStore, routeStore, screenStore } from "stores"
import { getContext, onMount } from "svelte"
import { get } from "svelte/store"
import { enrichButtonActions } from "../utils/buttonActions.js"
import Component from "./Component.svelte"
import Provider from "./context/Provider.svelte"

export let params = {}

const context = getContext("context")
const onLoadActions = memo()

// Get the screen definition for the current route
$: screenDefinition = $screenStore.activeScreen?.props
$: onLoadActions.set($screenStore.activeScreen?.onLoad)
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
{#if $routeStore.routerLoaded}
  {#key screenDefinition?._id}
    <Provider key="url" data={params}>
      <Component isRoot instance={screenDefinition} />
    </Provider>
  {/key}
{/if}
