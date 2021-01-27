<script>
  import { getContext, setContext } from "svelte"
  import { writable, get } from "svelte/store"
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"
  import { enrichProps, propsAreSame } from "../utils/componentProps"
  import { bindingStore, builderStore } from "../store"
  import { hashString } from "../utils/hash"

  export let definition = {}

  let enrichedProps
  let componentProps

  // Props are hashed when inside the builder preview and used as a key, so that
  // components fully remount whenever any props change
  let propsHash = 0

  // Get contexts
  const dataContext = getContext("data")

  // Create component context
  const componentStore = writable({})
  setContext("component", componentStore)

  // Extract component definition info
  $: constructor = getComponentConstructor(definition._component)
  $: children = definition._children || []
  $: id = definition._id
  $: enrichComponentProps(definition, $dataContext, $bindingStore)
  $: updateProps(enrichedProps)
  $: styles = definition._styles

  // Update component context
  $: componentStore.set({
    id,
    children: children.length,
    styles: { ...styles, id },
  })

  // Updates the component props.
  // Most props are deeply compared so that svelte will only trigger reactive
  // statements on props that have actually changed.
  const updateProps = props => {
    if (!props) {
      return
    }
    let propsChanged = false
    if (!componentProps) {
      componentProps = {}
      propsChanged = true
    }
    Object.keys(props).forEach(key => {
      if (!propsAreSame(props[key], componentProps[key])) {
        propsChanged = true
        componentProps[key] = props[key]
      }
    })
    if (get(builderStore).inBuilder && propsChanged) {
      propsHash = hashString(JSON.stringify(componentProps))
    }
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

  // Enriches any string component props using handlebars
  const enrichComponentProps = async (definition, context, bindingStore) => {
    enrichedProps = await enrichProps(definition, context, bindingStore)
  }
</script>

{#if constructor && componentProps}
  {#key propsHash}
    <svelte:component this={constructor} {...componentProps}>
      {#if children.length}
        {#each children as child (child._id)}
          <svelte:self definition={child} />
        {/each}
      {/if}
    </svelte:component>
  {/key}
{/if}
