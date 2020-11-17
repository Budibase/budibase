<script>
  import { componentStore } from "../store"
  import { getValidProps } from "../utils"

  export let definition = {}

  $: componentProps = getValidProps(definition)
  $: children = definition._children
  $: componentName = extractComponentName(definition._component)
  $: constructor = componentStore.actions.getComponent(componentName)
  $: id = `${componentName}-${definition._id}`
  $: styles = { ...definition._styles, id }

  // Extracts the actual component name from the library name
  function extractComponentName(name) {
    console.log(name)
    if (name == null) {
      console.log(definition)
    }
    const split = name.split("/")
    return split[split.length - 1]
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
