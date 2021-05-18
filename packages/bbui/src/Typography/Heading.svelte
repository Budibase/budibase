<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  // Sizes
  export let size = "M"
  export let textAlign
  export let noPadding = false
</script>

<h1
  style={textAlign ? `text-align:${textAlign}` : ``}
  class:noPadding
  class="spectrum-Heading spectrum-Heading--size{size}"
>
  <slot />
</h1>
