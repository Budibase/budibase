<script>
  export let errors = []

  $: hasErrors = errors.length > 0
</script>

{#if hasErrors}
  <div class="container bb__alert bb__alert--danger">
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
  }

  .error {
    font-size: var(--font-size-xs);
    font-weight: 500;
  }
  .error:first-letter {
    text-transform: uppercase;
  }
</style>
