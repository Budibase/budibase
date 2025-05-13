<script>
  import { Icon, TooltipPosition, TooltipType } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { automationStore } from "@/stores/builder"

  export let block

  const dispatch = createEventDispatcher()
</script>

<div class="action-bar">
  {#if !block.branchNode}
    <Icon
      hoverable
      name="Branch3"
      on:click={() => {
        dispatch("branch")
      }}
      tooltipType={TooltipType.Info}
      tooltipPosition={TooltipPosition.Left}
      tooltip={"Create branch"}
      size={"S"}
    />
  {/if}
  <Icon
    hoverable
    name="AddCircle"
    on:click={() => {
      automationStore.actions.openActionPanel(block)
    }}
    tooltipType={TooltipType.Info}
    tooltipPosition={TooltipPosition.Right}
    tooltip={"Add a step"}
    size={"S"}
  />
</div>

<style>
  .action-bar {
    background-color: var(--background);
    border-radius: 4px 4px 4px 4px;
    display: flex;
    gap: var(--spacing-m);
    padding: 8px 12px;
    cursor: default;
  }
</style>
