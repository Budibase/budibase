<script>
  import { fade } from "svelte/transition"
  import { screenStore, routeStore } from "../store"
  import Component from "./Component.svelte"
  import Provider from "./Provider.svelte"

  // Keep route params up to date
  export let params = {}
  $: routeStore.actions.setRouteParams(params || {})

  // Get the screen definition for the current route
  $: screenDefinition = $screenStore.activeScreen?.props

  // Redirect to home layout if no matching route
  $: screenDefinition == null && routeStore.actions.navigate("/")
</script>

<!-- Ensure to fully remount when screen changes -->
{#key screenDefinition?._id}
  <Provider key="url" data={params}>
    <div in:fade>
      <Component definition={screenDefinition} />
    </div>
  </Provider>
{/key}

<style>
  div {
    flex: 1 1 auto;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
