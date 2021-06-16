<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let disabled = false
  export let text = ""
  export let onClick
  export let size = "M"
  export let type = "primary"
</script>

<button
  class={`spectrum-Button spectrum-Button--size${size} spectrum-Button--${type}`}
  disabled={disabled || false}
  use:styleable={$component.styles}
  on:click={onClick}
>
  {text || ""}
</button>