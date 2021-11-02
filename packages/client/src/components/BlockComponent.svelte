<script>
  import { getContext } from "svelte"
  import { generate } from "shortid"
  import Component from "components/Component.svelte"

  export let type
  export let props
  export let styles
  export let id

  const block = getContext("block")
  const rand = generate()

  $: id = block.id + rand
  $: instance = createInstance(type, props, id)

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
