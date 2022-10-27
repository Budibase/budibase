<script>
  export let wide = false
  export let maxWidth = "1080px"
  export let noPadding = false
</script>

<div style="--max-width: {maxWidth}" class:wide class:noPadding>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    max-width: var(--max-width);
    margin: 0 auto;
    flex: 1 1 auto;
    padding-bottom: 50px;
  }

  .wide {
    max-width: none;
    margin: 0;
  }

  .noPadding {
    padding: 0px;
    margin: 0px;
  }
</style>
