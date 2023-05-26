<script>
  import { Body, Label } from "@budibase/bbui"

  export let title
  export let description
  export let disabled
</script>

<div on:click class:disabled class="option">
  <div class="header">
    <div class="icon">
      <slot />
    </div>
    <Body>{title}</Body>
  </div>
  <Label>{description}</Label>
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
</style>
