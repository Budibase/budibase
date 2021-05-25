<script>
  export let errors = []

  $: hasErrors = errors.length > 0
</script>

{#if hasErrors}
  <div class="container">
    {#each errors as error}
      <div class="error">{error.dataPath} {error.message}</div>
    {/each}
  </div>
{/if}

<style>
  .container {
    border-radius: var(--border-radius-m);
    margin: 0;
    padding: var(--spacing-m);
    background-color: var(--red-light);
  }

  .error {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--red-dark);
  }
  .error:first-letter {
    text-transform: uppercase;
  }
</style>
