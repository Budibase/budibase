<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let icon = ""
  export let size = "fa-lg"
  export let color = "#000"
</script>

<i
  style={`color: ${color};`}
  class={`${icon} ${size}`}
  use:styleable={$component.styles} />
