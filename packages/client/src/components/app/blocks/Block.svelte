<script>
  import { getContext, setContext } from "svelte"

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  setContext("block", {
    id: $component.id,
  })
</script>

<div use:styleable={$component.styles}>
  <slot />
</div>
