<script>
  export let value

  const displayLimit = 5
  $: attachments = value?.slice(0, displayLimit) ?? []
  $: leftover = (value?.length ?? 0) - attachments.length
</script>

{#each attachments as attachment}
  {#if attachment.type.startsWith('image')}
    <img src={attachment.url} alt={attachment.extension} />
  {:else}
    <div class="file">{attachment.extension}</div>
  {/if}
{/each}
{#if leftover}
  <div>+{leftover} others</div>
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
