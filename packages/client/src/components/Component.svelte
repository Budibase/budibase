<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"
  import { enrichDataBinding } from "../utils"
  import { bindingStore } from "../store"

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

  // Enriches data bindings to real values based on data context
  const enrichDataBindings = (dataContexts, dataBindings, props) => {
    const state = {
      ...dataContexts,
      ...dataBindings,
    }
    let enrichedProps = {}
    Object.entries(props).forEach(([key, value]) => {
      enrichedProps[key] = enrichDataBinding(value, state)
    })
    return enrichedProps
  }

  // Gets the component constructor for the specified component
  const getComponentConstructor = name => {
    return name === "screenslot" ? Router : ComponentLibrary[componentName]
  }

  // Extract component definition info
  $: componentName = extractComponentName(definition._component)
  $: constructor = getComponentConstructor(componentName)
  $: componentProps = extractValidProps(definition)
  $: children = definition._children
  $: id = definition._id
  $: dataContext = getContext("data")
  $: enrichedProps = enrichDataBindings(
    $dataContext,
    $bindingStore,
    componentProps
  )

  // Update component context
  // ID is duplicated inside style so that the "styleable" helper can set
  // an ID data tag for unique reference to components
  const componentStore = writable({})
  setContext("component", componentStore)
  $: componentStore.set({
    id,
    styles: { ...definition._styles, id },
    dataContext: $dataContext.data,
  })
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
