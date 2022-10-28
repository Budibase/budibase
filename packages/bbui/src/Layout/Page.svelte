<script>
  export let wide = false
  export let narrow = false
  export let noPadding = false
</script>

<div class:wide class:noPadding class:narrow>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    max-width: 1080px;
    margin: 0 auto;
    flex: 1 1 auto;
    padding-bottom: 50px;
  }

  .wide {
    max-width: none;
  }

  .narrow {
    max-width: 800px;
    margin: 0;
  }
</style>
