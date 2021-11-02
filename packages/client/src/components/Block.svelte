<script>
  import { getContext, setContext } from "svelte"

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  // We need to set a block context to know we're inside a block, but also
  // to be able to reference the actual component ID of the block from
  // any depth
  setContext("block", {
    id: $component.id,
  })
</script>

<div use:styleable={$component.styles}>
  <slot />
</div>
