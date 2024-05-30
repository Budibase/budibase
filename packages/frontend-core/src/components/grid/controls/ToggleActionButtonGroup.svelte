<script>
  import { createEventDispatcher } from "svelte"

  let dispatch = createEventDispatcher()

  import { ActionButton, AbsTooltip, TooltipType } from "@budibase/bbui"

  export let value
  export let options
  export let disabled
</script>

<div class="permissionPicker">
  {#each options as option}
    <AbsTooltip text={option.tooltip} type={TooltipType.Info}>
      <ActionButton
        on:click={() => dispatch("click", option.value)}
        {disabled}
        size="S"
        icon={option.icon}
        quiet
        selected={option.value === value}
        noPadding
      />
    </AbsTooltip>
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
    width: 28px;
    height: 28px;
  }
</style>
