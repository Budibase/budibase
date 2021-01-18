<script>
  import { getContext } from "svelte"

  // Add this back once we can define specific design options to expose
  // const { styleable } = getContext("sdk")
  // const component = getContext("component")

  export let icon = ""
  export let size = "fa-lg"
  export let color = "#000"
</script>

<i
  style={`color: ${color};`}
  class={`${icon} ${size}`} />
