<script>
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"

  export let definition = {}

  $: componentProps = extractValidProps(definition)
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
