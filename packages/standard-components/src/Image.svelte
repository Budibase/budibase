<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("app")

  export let className = ""
  export let url = ""
  export let description = ""
  export let height
  export let width
  export let styles
</script>

<img
  {height}
  {width}
  class={className}
  src={url}
  alt={description}
  use:styleable={styles} />
