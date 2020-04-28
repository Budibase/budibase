<script>
  export let errors = []

  $: hasErrors = errors.length > 0
</script>

{#if hasErrors}
  <div uk-alert class="uk-alert-danger">
    {#each errors as error}
      <div>{error.dataPath} {error.message}</div>
    {/each}
  </div>
{/if}
