<script>
  import { createEventDispatcher } from "svelte"

  let dispatch = createEventDispatcher()

  import { ActionButton, AbsTooltip, TooltipType } from "@budibase/bbui"

  export let value
  export let options
</script>

<div>
  {#each options as option}
    <AbsTooltip text={option.tooltip} type={TooltipType.Info}>
      <ActionButton
        on:click={() => dispatch("click", option.value)}
        disabled={option.disabled}
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
  div {
    display: flex;
    gap: var(--spacing-xs);
  }
  div :global(.spectrum-Icon) {
    width: 14px;
  }
  div :global(.spectrum-ActionButton) {
    width: 28px;
    height: 28px;
  }
</style>
