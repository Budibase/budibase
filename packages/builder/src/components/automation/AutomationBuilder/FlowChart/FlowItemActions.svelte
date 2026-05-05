<script lang="ts">
  import { Icon, TooltipPosition, TooltipType } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { type BlockRef } from "@budibase/types"

  export let block
  export let hideBranch = false
  export let showAddBranch = false
  export let branchStepId: string | undefined = undefined
  export let viewMode: ViewMode = ViewMode.EDITOR

  const dispatch = createEventDispatcher()

  $: blockRef = block?.id
    ? $selectedAutomation?.blockRefs?.[block.id]
    : undefined
  $: isInsideBranchInLoop = checkIsInsideBranchInLoop(blockRef)
  $: canShowAddBranch =
    showAddBranch &&
    branchStepId &&
    $selectedAutomation?.blockRefs?.[branchStepId] &&
    viewMode === ViewMode.EDITOR

  const checkIsInsideBranchInLoop = (blockRef: BlockRef | undefined) => {
    if (!blockRef?.pathTo) return false
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
      color="var(--automation-flow-action-icon-color)"
      hoverColor="var(--automation-flow-action-icon-hover-color)"
    />
  {/if}
  {#if canShowAddBranch}
    <Icon
      hoverable
      name="git-branch"
      weight="fill"
      on:click={() => {
        dispatch("addBranch")
      }}
      tooltipType={TooltipType.Info}
      tooltipPosition={TooltipPosition.Right}
      tooltip={"Add branch"}
      size="S"
      color="var(--automation-flow-action-icon-color)"
      hoverColor="var(--automation-flow-action-icon-hover-color)"
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
    color="var(--automation-flow-action-icon-color)"
    hoverColor="var(--automation-flow-action-icon-hover-color)"
  />
</div>

<style>
  .action-bar {
    --automation-flow-action-icon-color: var(--spectrum-global-color-gray-700);
    --automation-flow-action-icon-hover-color: var(
      --spectrum-global-color-gray-900
    );
    background-color: var(
      --automation-flow-action-background,
      var(--spectrum-global-color-gray-100)
    );
    border: var(--automation-flow-action-border, 0);
    border-radius: 4px 4px 4px 4px;
    display: flex;
    gap: var(--spacing-m);
    padding: 8px 12px;
    cursor: default;
  }

  :global(.spectrum--light) .action-bar,
  :global(.spectrum--lightest) .action-bar {
    --automation-flow-action-background: var(--spectrum-global-color-gray-50);
    --automation-flow-action-border: 1px solid
      var(--spectrum-global-color-gray-200);
    --automation-flow-action-icon-color: var(--spectrum-global-color-gray-900);
    --automation-flow-action-icon-hover-color: var(
      --spectrum-global-color-gray-900
    );
  }
</style>
