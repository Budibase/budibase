<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  // Sizes
  export let size = "M"
  export let textAlign = "left"
  export let noPadding = false
</script>

<h1
  style="text-align:{textAlign};"
  class:noPadding
  class="spectrum-Heading spectrum-Heading--size{size}"
>
  <slot />
</h1>
