<script>
  export let errors = []

  $: hasErrors = errors.length > 0
</script>

{#if hasErrors}
  <div class="bb__alert bb__alert--danger">
    {#each errors as error}
      <div>{error.dataPath} {error.message}</div>
    {/each}
  </div>
{/if}
