<script>
  import { Icon, TooltipPosition, TooltipType } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"

  export let block
  export let hideBranch = false

  const dispatch = createEventDispatcher()

  $: blockRef = block?.id ? $selectedAutomation?.blockRefs?.[block.id] : undefined
  $: isInsideBranchInLoop = checkIsInsideBranchInLoop(blockRef)

  const checkIsInsideBranchInLoop = (blockRef) => {
    if (!blockRef?.pathTo) return false

    // Only hide branch button if we're in a branch lane that's directly inside a loop
    // This is indicated by a hop that has BOTH loopStepId and branchIdx
    for (const hop of blockRef.pathTo) {
      if (hop.loopStepId && Number.isInteger(hop.branchIdx)) {
        return true
      }
    }

    return false
  }
</script>

<div class="action-bar">
  {#if !hideBranch && !block.branchNode && !isInsideBranchInLoop}
    <Icon
      hoverable
      name="git-branch"
      weight="fill"
      on:click={() => {
        dispatch("branch")
      }}
      tooltipType={TooltipType.Info}
      tooltipPosition={TooltipPosition.Left}
      tooltip={"Create branch"}
      size="S"
    />
  {/if}
  <Icon
    hoverable
    name="plus-circle"
    weight="fill"
    on:click={() => {
      automationStore.actions.openActionPanel(block)
    }}
    tooltipType={TooltipType.Info}
    tooltipPosition={TooltipPosition.Right}
    tooltip={"Add a step"}
    size="S"
  />
</div>

<style>
  .action-bar {
    background-color: var(--spectrum-global-color-gray-100);
    border-radius: 4px 4px 4px 4px;
    display: flex;
    gap: var(--spacing-m);
    padding: 8px 12px;
    cursor: default;
  }
</style>
