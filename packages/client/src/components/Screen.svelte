<script>
  import { fade } from "svelte/transition"
  import { screenStore, routeStore } from "../store"
  import Component from "./Component.svelte"

  // Keep route params up to date
  export let params
  $: routeStore.actions.setRouteParams(params || {})

  // Get the screen definition for the current route
  $: screenDefinition = $screenStore.activeScreen?.props

  // Redirect to home layout if no matching route
  $: screenDefinition == null && routeStore.actions.navigate("/")

  // Make a screen array so we can use keying to properly re-render each screen
  $: screens = screenDefinition ? [screenDefinition] : []
</script>

{#each screens as screen (screen._id)}
  <div in:fade>
    <Component definition={screen} />
  </div>
{/each}

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
