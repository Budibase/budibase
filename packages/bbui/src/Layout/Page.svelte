<script>
  export let wide = false
</script>

<div class:wide>
  <slot />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    max-width: 80ch;
    margin: 0 auto;
    padding: calc(var(--spacing-xl) * 2);
    min-height: calc(100% - var(--spacing-xl) * 4);
  }

  .wide {
    max-width: none;
    margin: 0;
  }
</style>
