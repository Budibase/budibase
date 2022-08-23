<script>
  import { getContext } from "svelte"
  import { generate } from "shortid"
  import { builderStore } from "../stores/builder.js"
  import Component from "components/Component.svelte"

  export let type
  export let props
  export let styles
  export let css
  export let context
  export let order = 0

  // ID is only exposed as a prop so that it can be bound to from parent
  // block components
  export let id

  const component = getContext("component")
  const block = getContext("block")
  const rand = generate()

  // Create a fake component instance so that we can use the core Component
  // to render this part of the block, taking advantage of binding enrichment
  $: id = `${block.id}-${context ?? rand}`
  $: instance = {
    _component: `@budibase/standard-components/${type}`,
    _id: id,
    _instanceName: type[0].toUpperCase() + type.slice(1),
    _styles: {
      normal: {
        ...styles,
      },
      custom: css,
    },
    ...props,
  }

  // Register this block component if we're inside the builder so it can be
  // ejected later
  $: {
    if ($builderStore.inBuilder) {
      block.registerComponent(id, order, $component?.id, instance)
    }
  }
</script>

<Component {instance} isBlock>
  <slot />
</Component>
