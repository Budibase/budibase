<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"
  import { enrichProps } from "../utils/componentProps"
  import { bindingStore, builderStore } from "../store"

  export let definition = {}

  // Get contexts
  const dataContext = getContext("data")
  const screenslotContext = getContext("screenslot")

  // Create component context
  const componentStore = writable({})
  setContext("component", componentStore)

  // Enrich component props
  let enrichedProps
  $: enrichComponentProps(definition, $dataContext, $bindingStore)

  // Extract component definition info
  $: constructor = getComponentConstructor(definition._component)
  $: children = definition._children
  $: id = definition._id
  $: styles = definition._styles

  // Allow component selection in the builder preview if we're previewing a
  // layout, or we're preview a screen and we're inside the screenslot
  $: allowSelection =
    $builderStore.previewType === "layout" || screenslotContext

  // Update component context
  $: componentStore.set({ id, styles: { ...styles, id, allowSelection } })

  // Gets the component constructor for the specified component
  const getComponentConstructor = component => {
    const split = component?.split("/")
    const name = split?.[split.length - 1]
    return name === "screenslot" ? Router : ComponentLibrary[name]
  }

  // Enriches any string component props using handlebars
  const enrichComponentProps = async (definition, context, bindingStore) => {
    enrichedProps = await enrichProps(definition, context, bindingStore)
  }

  // Returns a unique key to let svelte know when to remount components.
  // If a component is selected we want to remount it every time any props
  // change.
  const getChildKey = childId => {
    const selected = childId === $builderStore.selectedComponentId
    return selected ? `${childId}-${$builderStore.previewId}` : childId
  }
</script>

{#if constructor && enrichedProps}
  <svelte:component this={constructor} {...enrichedProps}>
    {#if children && children.length}
      {#each children as child (getChildKey(child._id))}
        <svelte:self definition={child} />
      {/each}
    {/if}
  </svelte:component>
{/if}
