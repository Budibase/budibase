<script>
  import "@spectrum-css/divider/dist/index-vars.css"
  export let size = "M"

  export let vertical = false
  export let noMargin = false
  export let noGrid = false
</script>

<hr
  class:noMargin
  class:noGrid
  class="spectrum-Divider spectrum-Divider--{vertical
    ? 'vertical'
    : 'horizontal'} spectrum-Dialog-divider spectrum-Divider--size{size}"
/>

<style>
  hr {
    background: var(--spectrum-global-color-gray-200);
  }
  hr.noMargin {
    margin: 0;
  }
  hr.noGrid {
    grid-area: auto;
  }
</style>
