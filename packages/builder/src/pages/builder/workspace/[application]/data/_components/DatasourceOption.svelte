<script>
  import { Body } from "@budibase/bbui"

  export let title
  export let disabled
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class:disabled class="option">
  <div class="header">
    <div class="icon">
      <slot />
    </div>
    <Body size="S" color="var(--spectrum-global-color-gray-900)">{title}</Body>
  </div>
</div>

<style>
  .option {
    background-color: var(--background);
    border: 0.5px solid var(--spectrum-global-color-gray-200);
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
  }

  .option :global(label) {
    cursor: pointer;
  }

  .option:hover {
    background-color: var(--background-alt);
  }

  .header {
    display: flex;
    align-items: center;
  }

  .icon {
    display: flex;
    margin-right: 8px;
  }

  .header :global(p) {
    margin: 0;
  }

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
