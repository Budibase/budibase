<script>
  export let errors = []

  $: hasErrors = errors.length > 0
</script>

{#if hasErrors}
  <div class="error-container">
    {#each errors as error}
      <div class="error-row">
        {error.field ? `${error.field}: ` : ''}{error.error}
      </div>
    {/each}
  </div>
{/if}

<style>
  .error-container {
    padding: 10px;
    border-style: solid;
    border-color: var(--deletion100);
    border-radius: var(--borderradiusall);
    background: var(--deletion75);
  }

  .error-row {
    padding: 5px 0px;
  }
</style>
