<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"
  import { enrichProps, propsAreSame } from "../utils/componentProps"
  import { bindingStore, builderStore } from "../store"

  export let definition = {}
  let componentProps = {}

  // Get contexts
  const dataContext = getContext("data")
  const screenslotContext = getContext("screenslot")

  // Create component context
  const componentStore = writable({})
  setContext("component", componentStore)

  // Extract component definition info
  $: constructor = getComponentConstructor(definition._component)
  $: children = definition._children
  $: id = definition._id
  $: enrichedProps = enrichProps(definition, $dataContext, $bindingStore)
  $: updateProps(enrichedProps)
  $: styles = definition._styles

  // Allow component selection in the builder preview if we're previewing a
  // layout, or we're preview a screen and we're inside the screenslot
  $: allowSelection =
    $builderStore.previewType === "layout" || screenslotContext

  // Update component context
  $: componentStore.set({ id, styles: { ...styles, id, allowSelection } })

  // Updates the component props.
  // Most props are deeply compared so that svelte will only trigger reactive
  // statements on props that have actually changed.
  const updateProps = props => {
    Object.keys(props).forEach(key => {
      if (!propsAreSame(props[key], componentProps[key])) {
        componentProps[key] = props[key]
      }
    })
  }

  // Gets the component constructor for the specified component
  const getComponentConstructor = component => {
    const split = component?.split("/")
    const name = split?.[split.length - 1]
    if (name === "screenslot" && $builderStore.previewType !== "layout") {
      return Router
    }
    return ComponentLibrary[name]
  }

  // Returns a unique key to let svelte know when to remount components.
  // If a component is selected we want to remount it every time any props
  // change.
  const getChildKey = childId => {
    const selected = childId === $builderStore.selectedComponentId
    return selected ? `${childId}-${$builderStore.previewId}` : childId
  }
</script>

{#if constructor}
  <svelte:component this={constructor} {...componentProps}>
    {#if children && children.length}
      {#each children as child (getChildKey(child._id))}
        <svelte:self definition={child} />
      {/each}
    {/if}
  </svelte:component>
{/if}
