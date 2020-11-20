<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const styles = getContext("style")

  export let value = ""
  export let className = ""
  export let type = "text"

  const onchange = ev => {
    value = ev.target.value
  }
</script>

<input
  class={className}
  {type}
  {value}
  on:change={onchange}
  use:styleable={styles} />
