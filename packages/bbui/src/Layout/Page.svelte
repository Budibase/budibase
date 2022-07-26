<script>
  export let wide = false
  export let maxWidth = "80ch"
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
    padding: calc(var(--spacing-xl) * 2);
    min-height: calc(100% - var(--spacing-xl) * 4);
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
