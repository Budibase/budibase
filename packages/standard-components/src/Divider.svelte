<script>
  import { getContext } from "svelte"
  import "@spectrum-css/divider/dist/index-vars.css"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let size = "M"

  export let vertical = false
</script>

<hr
  use:styleable={$component.styles}
  class="spectrum-Divider spectrum-Divider--{vertical
    ? 'vertical'
    : 'horizontal'} spectrum-Dialog-divider spectrum-Divider--size{size}"
/>
