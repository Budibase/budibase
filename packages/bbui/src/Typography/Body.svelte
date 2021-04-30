<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size = "M"
  export let serif = false
</script>

<p
  class="spectrum-Body class:spectrum-Body--size{size}"
  class:spectrum-Body--serif={serif}
>
  <slot />
</p>
