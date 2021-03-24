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
    height: 32px;
    max-width: 64px;
  }
  .file {
    height: 32px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0 8px;
    color: var(--spectrum-global-color-gray-800);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 2px;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 11px;
  }
</style>
