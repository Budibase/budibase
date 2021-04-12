<script>
  import { getContext } from "svelte"

  const { styleable, transition } = getContext("sdk")
  const component = getContext("component")
</script>

<div
  in:transition={{ type: $component.transition }}
  use:styleable={$component.styles}>
  <slot />
</div>
