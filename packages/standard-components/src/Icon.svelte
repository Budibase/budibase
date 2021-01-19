<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let icon = ""
  export let size = "fa-lg"
  export let color = "#000"
</script>

<div style="color: {color}; display: contents">
  <i
  use:styleable={$component.styles}
  class="{icon} {size}" />
</div>