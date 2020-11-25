<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"
  import { enrichProps } from "../utils/componentProps"
  import { bindingStore } from "../store"

  export let definition = {}

  // Get local data binding context
  const dataContext = getContext("data")

  // Create component context
  const componentStore = writable({})
  setContext("component", componentStore)

  // Extract component definition info
  $: constructor = getComponentConstructor(definition._component)
  $: children = definition._children
  $: id = definition._id
  $: enrichedProps = enrichProps(definition, $dataContext, $bindingStore)

  // Update component context
  // ID is duplicated inside style so that the "styleable" helper can set
  // an ID data tag for unique reference to components
  $: componentStore.set({ id, styles: { ...definition._styles, id } })

  // Gets the component constructor for the specified component
  const getComponentConstructor = component => {
    const split = component?.split("/")
    const name = split?.[split.length - 1]
    return name === "screenslot" ? Router : ComponentLibrary[name]
  }
</script>

{#if constructor}
  <svelte:component this={constructor} {...enrichedProps}>
    {#if children && children.length}
      {#each children as child (child._id)}
        <svelte:self definition={child} />
      {/each}
    {/if}
  </svelte:component>
{/if}
