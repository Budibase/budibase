<script>
  import { getContext, setContext } from "svelte"
  import { writable, get } from "svelte/store"
  import * as ComponentLibrary from "@budibase/standard-components"
  import Router from "./Router.svelte"
  import { enrichProps, propsAreSame } from "../utils/componentProps"
  import { builderStore } from "../store"
  import { hashString } from "../utils/hash"
  import Manifest from "@budibase/standard-components/manifest.json"

  export let instance = {}

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

  // Extract component instance info
  $: constructor = getComponentConstructor(instance._component)
  $: definition = getComponentDefinition(instance._component)
  $: children = instance._children || []
  $: id = instance._id
  $: name = instance._instanceName
  $: empty =
    !children.length &&
    definition?.hasChildren &&
    definition?.showEmptyState !== false &&
    $builderStore.inBuilder
  $: updateComponentProps(instance, $context)
  $: selected =
    $builderStore.inBuilder &&
    $builderStore.selectedComponentId === instance._id

  // Update component context
  $: componentStore.set({
    id,
    children: children.length,
    styles: { ...instance._styles, id, empty },
    empty,
    transition: instance._transition,
    selected,
    props: componentProps,
    name,
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

  const getComponentDefinition = component => {
    const prefix = "@budibase/standard-components/"
    const type = component?.replace(prefix, "")
    return type ? Manifest[type] : null
  }

  // Enriches any string component props using handlebars
  const updateComponentProps = (instance, context) => {
    // Record the timestamp so we can reference it after enrichment
    latestUpdateTime = Date.now()
    const enrichmentTime = latestUpdateTime

    // Enrich props with context
    const enrichedProps = enrichProps(instance, context)

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

<div
  class={`component ${id}`}
  data-type="component"
  data-id={id}
  data-name={name}
>
  {#key propsHash}
    {#if constructor && componentProps}
      <svelte:component this={constructor} {...componentProps}>
        {#if children.length}
          {#each children as child (child._id)}
            <svelte:self instance={child} />
          {/each}
        {:else if empty}
          <div class="placeholder">{name}</div>
        {/if}
      </svelte:component>
    {/if}
  {/key}
</div>

<style>
  .component {
    display: contents;
  }
  .placeholder {
    color: #888;
    padding: 20px;
  }
</style>
