<script>
  import { Tooltip } from "@budibase/bbui"

  export let text
  export let url
  export let active = false
  export let disabled = false
  export let tooltip = null
</script>

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
  {#if tooltip}
    <div class="tooltip">
      <Tooltip textWrapping direction="right" text={tooltip} />
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
  .tooltip {
    position: absolute;
    transform: translateY(-50%);
    left: 100%;
    top: 50%;
    opacity: 0;
    pointer-events: none;
    transition: opacity 130ms ease-out;
    z-index: 100;
  }
  .side-nav-item:hover .tooltip {
    opacity: 1;
  }
</style>
