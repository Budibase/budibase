<script>
  import { screenStore } from "@budibase/component-sdk"
  import { location } from "svelte-spa-router"
  import Component from "./Component.svelte"
  import { getValidProps } from "../utils"

  export let params

  // Get the screen definition for the current route
  $: screenDefinition = screenStore.actions.getScreenByRoute($location)
  $: screenStore.actions
</script>

{#if screenDefinition}
  <Component
    component={screenDefinition.props._component}
    props={getValidProps(screenDefinition.props)}
    children={screenDefinition.props._children}
    styles={screenDefinition.props._styles.normal} />
{/if}
