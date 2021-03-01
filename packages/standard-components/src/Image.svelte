<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let className = ""
  export let url = ""
  export let description = ""
  export let height
  export let width
</script>

<img
  {height}
  {width}
  class={className}
  src={url}
  alt={description}
  use:styleable={$component.styles} />
