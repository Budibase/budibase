<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size = "M"
  export let serif = false
  export let noPadding = false
  export let weight = 400
  export let textAlign = "left"
</script>

<p
  style="font-weight:{weight};text-align:{textAlign};"
  class:noPadding
  class="spectrum-Body spectrum-Body--size{size}"
  class:spectrum-Body--serif={serif}
>
  <slot />
</p>

<style>
  p {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
  }
  .noPadding {
    padding: 0;
    margin: 0;
  }
</style>
