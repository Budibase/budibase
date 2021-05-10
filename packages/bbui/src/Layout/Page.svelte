<script>
  export let wide = false
</script>

<div class:wide>
  <slot />
</div>

<style>
  div {
    display: grid;
    grid-template-columns: 1fr;
    max-width: 80ch;
    margin: 0 auto;
    padding: calc(var(--spacing-xl) * 2);
  }

  .wide {
    max-width: none;
    margin: 0;
    padding: var(--spacing-xl) calc(var(--spacing-xl) * 2)
      calc(var(--spacing-xl) * 2) calc(var(--spacing-xl) * 2);
  }
</style>
