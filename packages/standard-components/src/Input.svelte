<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("app")

  export let value = ""
  export let className = ""
  export let type = "text"
  export let styles

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
