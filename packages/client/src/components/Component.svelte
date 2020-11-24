<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"

  export let definition = {}

  // Extracts the actual component name from the library name
  const extractComponentName = name => {
    const split = name?.split("/")
    return split?.[split.length - 1]
  }

  // Extracts valid props to pass to the real svelte component
  const extractValidProps = component => {
    let props = {}
    Object.entries(component)
      .filter(([name]) => !name.startsWith("_"))
      .forEach(([key, value]) => {
        props[key] = value
      })
    return props
  }

  // Gets the component constructor for the specified component
  const getComponentConstructor = name => {
    return name === "screenslot" ? Router : ComponentLibrary[componentName]
  }

  // Extract component definition info
  $: componentName = extractComponentName(definition._component)
  $: constructor = getComponentConstructor(componentName)
  $: componentProps = extractValidProps(definition)
  $: dataContext = getContext("data")
  $: enrichedProps = dataContext.actions.enrichDataBindings(componentProps)
  $: children = definition._children

  // Set observable style context
  const styleStore = writable({})
  setContext("style", styleStore)
  $: styleStore.set({ ...definition._styles, id: definition._id })
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
