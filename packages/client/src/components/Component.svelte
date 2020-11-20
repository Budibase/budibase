<script>
  import { getContext, setContext } from "svelte"
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
  const componentName = extractComponentName(definition._component)
  const constructor = getComponentConstructor(componentName)
  const id = `${componentName}-${definition._id}`
  const componentProps = extractValidProps(definition)
  const dataContext = getContext("data")
  const enrichedProps = dataContext.actions.enrichDataBindings(componentProps)
  const children = definition._children

  // Set style context to be consumed by component
  setContext("style", { ...definition._styles, id })
  $: console.log("Rendering: " + componentName)
</script>

{#if constructor}
  <svelte:component this={constructor} {...enrichedProps}>
    {#if children && children.length}
      {#each children as child}
        <svelte:self definition={child} />
      {/each}
    {/if}
  </svelte:component>
{/if}
