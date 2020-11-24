<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const styles = getContext("style")

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
  use:styleable={$styles} />
