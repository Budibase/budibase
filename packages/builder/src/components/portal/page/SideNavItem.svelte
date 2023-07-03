<script>
  export let text
  export let url
  export let active = false
</script>

{#if url}
  <a on:click href={url} class:active>
    {text || ""}
  </a>
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span on:click class:active>
    {text || ""}
  </span>
{/if}

<style>
  a,
  span {
    padding: var(--spacing-s) var(--spacing-m);
    color: var(--spectrum-global-color-gray-900);
    border-radius: 4px;
    transition: background 130ms ease-out;
  }
  .active,
  span:hover,
  a:hover {
    background-color: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
</style>
