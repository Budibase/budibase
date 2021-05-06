<script>
  import "@spectrum-css/typography/dist/index-vars.css"

  export let size = "M"
  export let serif = false
  export let noPadding = false
</script>

<p
  class:noPadding
  class="spectrum-Body class:spectrum-Body--size{size}"
  class:spectrum-Body--serif={serif}
>
  <slot />
</p>

<style>
  .noPadding {
    padding: 0;
    margin: 0;
  }
</style>
