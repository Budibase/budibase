<script>
  import { screenStore, builderStore } from "stores"
  import { get } from "svelte/store"
  import Component from "./Component.svelte"
  import Provider from "./context/Provider.svelte"
  import { getContext } from "svelte"
  import { enrichButtonActions } from "../utils/buttonActions.js"
  import { memo } from "@budibase/frontend-core"

  export let params = {}

  const context = getContext("context")
  const onLoadActions = memo()

  // Get the screen definition for the current route
  $: screenDefinition = $screenStore.activeScreen?.props
  $: onLoadActions.set($screenStore.activeScreen?.onLoad)
  $: runOnLoadActions($onLoadActions, params)
  $: screenId = screenDefinition?._id

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
</script>

<!-- Ensure to fully remount when screen changes -->
{#if screenDefinition}
  {#key screenId}
    <Provider key="url" data={params}>
      <Component isRoot instance={screenDefinition} />
    </Provider>
  {/key}
{/if}
