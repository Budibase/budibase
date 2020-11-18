<script>
  import "@fortawesome/fontawesome-free/js/all.js"
  import { getContext } from "svelte"

  const { styleable } = getContext("app")

  export let icon = ""
  export let size = "fa-lg"
  export let color = "#000"
  export let styles
</script>

<i
  style={`color: ${color};`}
  class={`${icon} ${size}`}
  use:styleable={styles} />
