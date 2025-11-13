<script>
  import { Body, Label } from "@budibase/bbui"

  export let title
  export let description = undefined
  export let disabled
  export let centered = false
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class:disabled class:centred={centered} class="option">
  <div class="header">
    <div class="icon">
      <slot />
    </div>
    <Body>{title}</Body>
  </div>
  {#if description}
    <Label>{description}</Label>
  {/if}
</div>

<style>
  .option {
    background-color: var(--background);
    border: 1px solid var(--grey-4);
    padding: 10px 16px 14px;
    border-radius: 4px;
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
    margin-bottom: 8px;
    align-items: center;
  }

  .icon {
    display: flex;
    margin-right: 8px;
  }

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .option.centred {
    padding: 12px;
  }

  .option.centred .header {
    justify-content: center;
    margin-bottom: 0;
  }
</style>
