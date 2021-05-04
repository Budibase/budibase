<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  // Sizes
  export let size = "M"

  export let serif = false
</script>

<p
  class="spectrum-Detail spectrum-Detail--size{size}"
  class:spectrum-Detail--serif={serif}
>
  <slot />
</p>
