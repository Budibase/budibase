<script>
  import "@spectrum-css/link/dist/index-vars.css"

  export let href = "#"
  export let size = "M"
  export let quiet = false
  export let primary = false
  export let secondary = false
  export let overBackground = false
  export let target
  export let download
</script>

<a
  on:click
  {href}
  {target}
  {download}
  class:spectrum-Link--primary={primary}
  class:spectrum-Link--secondary={secondary}
  class:spectrum-Link--overBackground={overBackground}
  class:spectrum-Link--quiet={quiet}
  class="spectrum-Link spectrum-Link--size{size}"><slot /></a
>
