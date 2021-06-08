<script>
  import { getContext, setContext } from "svelte"
  import { writable, get } from "svelte/store"
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"
  import { enrichProps, propsAreSame } from "../utils/componentProps"
  import { builderStore } from "../store"
  import { hashString } from "../utils/hash"

  export let definition = {}

  // Props that will be passed to the component instance
  let componentProps

  // Props are hashed when inside the builder preview and used as a key, so that
  // components fully remount whenever any props change
  let propsHash = 0

  // Latest timestamp that we started a props update.
  // Due to enrichment now being async, we need to avoid overwriting newer
  // props with old ones, depending on how long enrichment takes.
  let latestUpdateTime

  // Get contexts
  const context = getContext("context")

  // Create component context
  const componentStore = writable({})
  setContext("component", componentStore)

  // Extract component definition info
  $: constructor = getComponentConstructor(definition._component)
  $: children = definition._children || []
  $: id = definition._id
  $: name = definition._instanceName
  $: updateComponentProps(definition, $context)
  $: styles = definition._styles
  $: transition = definition._transition
  $: selected =
    $builderStore.inBuilder &&
    $builderStore.selectedComponentId === definition._id

  // Update component context
  $: componentStore.set({
    id,
    children: children.length,
    styles: { ...styles, id },
    transition,
    selected,
    props: componentProps,
  })

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
  const updateComponentProps = (definition, context) => {
    // Record the timestamp so we can reference it after enrichment
    latestUpdateTime = Date.now()
    const enrichmentTime = latestUpdateTime

    // Enrich props with context
    const enrichedProps = enrichProps(definition, context)

    // Abandon this update if a newer update has started
    if (enrichmentTime !== latestUpdateTime) {
      return
    }

    // Update the component props.
    // Most props are deeply compared so that svelte will only trigger reactive
    // statements on props that have actually changed.
    if (!enrichedProps) {
      return
    }
    let propsChanged = false
    if (!componentProps) {
      componentProps = {}
      propsChanged = true
    }
    Object.keys(enrichedProps).forEach(key => {
      if (!propsAreSame(enrichedProps[key], componentProps[key])) {
        propsChanged = true
        componentProps[key] = enrichedProps[key]
      }
    })

    // Update the hash if we're in the builder so we can fully remount this
    // component
    if (get(builderStore).inBuilder && propsChanged) {
      propsHash = hashString(JSON.stringify(componentProps))
    }
  }
</script>

<div class={id} data-type="component" data-id={id} data-name={name}>
  {#key propsHash}
    {#if constructor && componentProps}
      <svelte:component this={constructor} {...componentProps}>
        {#if children.length}
          {#each children as child (child._id)}
            <svelte:self definition={child} />
          {/each}
        {/if}
      </svelte:component>
    {/if}
  {/key}
</div>

<style>
  div {
    display: contents;
  }
</style>
