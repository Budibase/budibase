<script>
  export let text
  export let url
  export let active = false
  export let disabled = false
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="side-nav-item">
  {#if url}
    <a class="text" on:click href={url} class:active class:disabled>
      {text || ""}
    </a>
  {:else}
    <div class="text" on:click class:active class:disabled>
      {text || ""}
    </div>
  {/if}
</div>

<style>
  .side-nav-item {
    position: relative;
  }
  .text {
    display: block;
    padding: var(--spacing-s) var(--spacing-m);
    color: var(--spectrum-global-color-gray-900);
    border-radius: 4px;
    transition: background 130ms ease-out;
  }
  .active,
  .text:hover {
    background-color: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
  .disabled {
    pointer-events: none;
    color: var(--spectrum-global-color-gray-500) !important;
  }
</style>
