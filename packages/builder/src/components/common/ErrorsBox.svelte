<script>
  export let errors = []

  $: hasErrors = errors.length > 0
</script>

{#if hasErrors}
  <div uk-alert class="uk-alert-danger">
    {#each errors as error}
      <div>{error.field ? `${error.field}: ` : ''}{error.error}</div>
    {/each}
  </div>
{/if}
