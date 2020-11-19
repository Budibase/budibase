<script>
  import { getContext } from "svelte"
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"
  import enrichDataBinding from "../utils/enrichDataBinding"

  const dataProviderStore = getContext("data")

  export let definition = {}

  $: contextRow = dataProviderStore ? $dataProviderStore.row : undefined
  $: componentProps = extractValidProps(definition, contextRow)
  $: children = definition._children
  $: componentName = extractComponentName(definition._component)
  $: constructor = getComponentConstructor(componentName)
  $: id = `${componentName}-${definition._id}`
  $: styles = { ...definition._styles, id }

  // Extracts the actual component name from the library name
  const extractComponentName = name => {
    const split = name?.split("/")
    return split?.[split.length - 1]
  }

  // Extracts valid props to pass to the real svelte component
  const extractValidProps = (component, row) => {
    let props = {}
    const enrich = value => enrichDataBinding(value, { data: row })
    Object.entries(component)
      .filter(([name]) => !name.startsWith("_"))
      .forEach(([key, value]) => {
        props[key] = row === undefined ? value : enrich(value)
      })
    return props
  }

  // Gets the component constructor for the specified component
  const getComponentConstructor = name => {
    return name === "screenslot" ? Router : ComponentLibrary[componentName]
  }

  $: console.log("Rendering: " + componentName)
</script>

{#if constructor}
  <svelte:component this={constructor} {...componentProps} {styles}>
    {#if children && children.length}
      {#each children as child}
        <svelte:self definition={child} />
      {/each}
    {/if}
  </svelte:component>
{/if}
