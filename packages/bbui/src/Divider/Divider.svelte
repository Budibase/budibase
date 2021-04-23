<script>
  import "@spectrum-css/divider/dist/index-vars.css"
  export let l = false
  export let m = false
  export let s = false

  export let vertical = false
  export let noMargin = false
  export let noGrid = false

  $: useDefault = ![l, m, s].includes(true)
</script>

<hr
  class:noMargin
  class:noGrid
  class:spectrum-Divider--sizeL={l}
  class:spectrum-Divider--sizeM={m || useDefault}
  class:spectrum-Divider--sizeS={s}
  class="spectrum-Divider spectrum-Divider--{vertical ? 'vertical' : 'horizontal'} spectrum-Dialog-divider" />

<style>
  hr.noMargin {
    margin: 0;
  }
  hr.noGrid {
    grid-area: auto;
  }
</style>
