<script>
  import AbsTooltip from "./AbsTooltip.svelte"
  import { onDestroy } from "svelte"

  export let text = null
  export let condition = true
  export let duration = 5000
  export let position
  export let type

  let visible = false
  let timeout

  $: {
    if (condition) {
      showTooltip()
    } else {
      hideTooltip()
    }
  }

  const showTooltip = () => {
    visible = true
    timeout = setTimeout(() => {
      visible = false
    }, duration)
  }

  const hideTooltip = () => {
    visible = false
    clearTimeout(timeout)
  }

  onDestroy(hideTooltip)
</script>

<AbsTooltip {position} {type} text={visible ? text : null} fixed={visible}>
  <slot />
</AbsTooltip>
