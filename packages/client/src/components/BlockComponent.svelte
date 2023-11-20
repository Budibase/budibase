<script>
  import { getContext, onDestroy } from "svelte"
  import { generate } from "shortid"
  import { builderStore } from "../stores/builder.js"
  import Component from "components/Component.svelte"

  export let type
  export let props
  export let styles
  export let context
  export let name
  export let order = 0
  export let containsSlot = false

  // ID is only exposed as a prop so that it can be bound to from parent
  // block components
  export let id

  const component = getContext("component")
  const block = getContext("block")
  const rand = generate()

  // Create a fake component instance so that we can use the core Component
  // to render this part of the block, taking advantage of binding enrichment
  $: id = `${block.id}-${context ?? rand}`
  $: parentId = $component?.id
  $: inBuilder = $builderStore.inBuilder
  $: instance = {
    ...props,
    _component: getComponent(type),
    _id: id,
    _instanceName: getInstanceName(name, type),
    _containsSlot: containsSlot,
    _styles: {
      ...styles,
      normal: styles?.normal || {},
    },
  }

  // Register this block component if we're inside the builder so it can be
  // ejected later
  $: {
    if (inBuilder) {
      block.registerComponent(id, parentId, order ?? 0, instance)
    }
  }

  const getComponent = type => {
    if (!type) {
      return null
    }
    if (type.startsWith("plugin/")) {
      return type
    } else {
      return `@budibase/standard-components/${type}`
    }
  }

  const getInstanceName = (name, type) => {
    if (name) {
      return name
    }
    if (!type) {
      return "New component"
    }
    if (type.startsWith("plugin/")) {
      type = type.split("plugin/")[1]
    }
    return type[0].toUpperCase() + type.slice(1)
  }

  onDestroy(() => {
    if (inBuilder) {
      block.unregisterComponent(id, parentId)
    }
  })
</script>

<Component {instance} isBlock>
  <slot />
</Component>
