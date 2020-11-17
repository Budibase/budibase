<script>
  import { screenStore, routeStore } from "@budibase/component-sdk"
  import Component from "./Component.svelte"
  import { getValidProps } from "../utils"

  export let params

  // Get the screen definition for the current route
  $: screenDefinition = $screenStore.activeScreen

  // Update route params
  $: routeStore.actions.setRouteParams(params)

  // Redirect to home page if no matching route
  $: {
    if (screenDefinition == null) {
      routeStore.actions.navigate("/")
    }
  }
</script>

{#if screenDefinition}
  <Component definition={screenDefinition.props} />
{/if}
