<script>
  import { createEventDispatcher } from "svelte"

  let dispatch = createEventDispatcher()

  import { ActionButton } from "@budibase/bbui"

  export let value
  export let options
  export let disabled
</script>

<div class="permissionPicker">
  {#each options as option}
    <ActionButton
      on:click={() => dispatch("click", option.value)}
      {disabled}
      size="S"
      icon={option.icon}
      quiet
      selected={option.value === value}
      noPadding
      tooltip={option.tooltip}
    />
  {/each}
</div>

<style>
  .permissionPicker {
    display: flex;
    gap: var(--spacing-xs);
    padding-left: calc(var(--spacing-xl) * 2);
  }

  .permissionPicker :global(.spectrum-Icon) {
    width: 14px;
  }
  .permissionPicker :global(.spectrum-ActionButton) {
    width: 22px;
  }
</style>
