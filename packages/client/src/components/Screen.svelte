<script>
  import { screenStore, routeStore } from "../store"
  import Component from "./Component.svelte"

  // Keep route params up to date
  export let params
  $: routeStore.actions.setRouteParams(params || {})

  // Get the screen definition for the current route
  $: screenDefinition = $screenStore.activeScreen?.props

  // Redirect to home page if no matching route
  $: screenDefinition == null && routeStore.actions.navigate("/")
</script>

{#if screenDefinition}
  <Component definition={screenDefinition} />
{/if}
