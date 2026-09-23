<script lang="ts">
  import { Icon, TooltipPosition, TooltipType } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { ViewMode, type FlowBlockContext } from "@/types/automations"
  import { type BlockRef } from "@budibase/types"

  export let block: BlockRef | FlowBlockContext | undefined
  export let hideBranch = false
  export let showAddBranch = false
  export let branchStepId: string | undefined = undefined
  export let viewMode: ViewMode = ViewMode.EDITOR

  const dispatch = createEventDispatcher()

  $: blockRef =
    block && "id" in block && block.id
      ? $selectedAutomation?.blockRefs?.[block.id]
      : undefined
  $: isInsideBranchInLoop = checkIsInsideBranchInLoop(blockRef)
  $: canShowAddBranch =
    showAddBranch &&
    branchStepId &&
    $selectedAutomation?.blockRefs?.[branchStepId] &&
    viewMode === ViewMode.EDITOR
  $: isActiveInsertionPoint =
    getActionTargetKey($automationStore.actionPanelBlock) ===
    getActionTargetKey(block)
  $: isBranchBlock = isBranchTarget(block)

  const checkIsInsideBranchInLoop = (blockRef: BlockRef | undefined) => {
    if (!blockRef?.pathTo) return false
    for (const hop of blockRef.pathTo) {
      if (hop.loopStepId && Number.isInteger(hop.branchIdx)) {
        return true
      }
    }

    return false
  }

  type ActionTarget = BlockRef | FlowBlockContext
  type LoopTarget = Extract<FlowBlockContext, { insertIntoLoopV2: true }>
  type BranchTarget = Extract<FlowBlockContext, { branchNode: true }>

  const isLoopTarget = (value: ActionTarget): value is LoopTarget =>
    "insertIntoLoopV2" in value && value.insertIntoLoopV2 === true

  const isBranchTarget = (
    value: ActionTarget | undefined
  ): value is BranchTarget =>
    value !== undefined && "branchNode" in value && value.branchNode === true

  const getBranchKey = (target: {
    branchStepId?: string
    branchIdx?: number
  }) => {
    if (target.branchStepId === undefined && target.branchIdx === undefined) {
      return "root"
    }
    return `branch:${target.branchStepId ?? ""}:${target.branchIdx ?? ""}`
  }

  const getLoopSourceKey = (target: LoopTarget, branchKey: string) => {
    if ("id" in target) {
      return `step:${target.id}`
    }
    if (isBranchTarget(target)) {
      return branchKey
    }
    return "unknown"
  }

  const getActionTargetKey = (target: ActionTarget | undefined) => {
    if (!target) {
      return undefined
    }

    if (isLoopTarget(target)) {
      const branchKey = getBranchKey(target)
      const sourceKey = getLoopSourceKey(target, branchKey)

      return [
        "loop",
        target.loopStepId,
        target.loopChildInsertIndex,
        branchKey,
        sourceKey,
      ].join(":")
    }

    if (isBranchTarget(target)) {
      return ["branch", target.branchStepId, target.branchIdx].join(":")
    }

    return "id" in target ? `step:${target.id}` : undefined
  }
</script>

<div class="action-bar" class:active-insertion-point={isActiveInsertionPoint}>
  {#if !hideBranch && !isBranchBlock && !isInsideBranchInLoop}
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
    color={isActiveInsertionPoint
      ? "var(--spectrum-global-color-blue-600)"
      : "var(--automation-flow-action-icon-color)"}
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
    border-radius: 16px;
    display: flex;
    width: fit-content;
    box-sizing: border-box;
    gap: var(--spacing-m);
    justify-content: center;
    padding: 8px;
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
