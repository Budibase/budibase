<script>
  import { getContext } from "svelte"
  import { generate } from "shortid"
  import Component from "components/Component.svelte"

  export let type
  export let props
  export let styles

  // ID is only exposed as a prop so that it can be bound to from parent
  // block components
  export let id

  const block = getContext("block")
  const rand = generate()

  $: id = block.id + rand
  $: instance = createInstance(type, props, id)

  // Create a fake component instance so that we can use the core Component
  // to render this part of the block, taking advantage of binding enrichment
  const createInstance = (type, props, id) => {
    return {
      _component: `@budibase/standard-components/${type}`,
      _id: id,
      _styles: {
        normal: {
          ...styles,
        },
      },
      ...props,
    }
  }
</script>

<Component {instance}>
  <slot />
</Component>
