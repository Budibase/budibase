<script>
  export let value
</script>

{#if value && value.length}
  {#each value as attachment}
    {#if attachment.type.startsWith('image')}
      <img src={attachment.url} alt={attachment.extension} />
    {:else}
      <div class="file">{attachment.extension}</div>
    {/if}
  {/each}
{/if}

<style>
  img {
    height: 24px;
    max-width: 50px;
  }
  .file {
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0 8px;
    color: var(--spectrum-global-color-gray-500);
    border: 1px solid var(--spectrum-global-color-gray-500);
    border-radius: 2px;
    text-transform: uppercase;
  }
</style>
