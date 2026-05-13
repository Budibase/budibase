<script lang="ts">
  import { Icon, TooltipPosition, TooltipType } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { getContext } from "svelte"
  import type { BranchFlowContext, FlowBlockPath } from "@/types/automations"
  import { isBranchStep } from "@budibase/types"
  import {
    BRANCH_DELETE_DIALOG_CONTEXT,
    type BranchDeleteDialogContext,
  } from "../branchDeleteDialogContext"

  export let block

  const branchDeleteDialog = getContext<BranchDeleteDialogContext>(
    BRANCH_DELETE_DIALOG_CONTEXT
  )

  $: branchContext = isBranchContext(block) ? block : undefined
  $: branchStepRef = branchContext
    ? $selectedAutomation?.blockRefs?.[branchContext.branchStepId]
    : undefined
  $: branchStep = automationStore.actions.getBlockByRef(
    $selectedAutomation?.data,
    branchStepRef
  )
  $: branch =
    branchStep && isBranchStep(branchStep) && branchContext
      ? branchStep.inputs?.branches?.[branchContext.branchIdx]
      : undefined
  $: canDeleteBranch =
    branchStep && isBranchStep(branchStep)
      ? (branchStep.inputs?.branches?.length || 0) > 2
      : false
  $: branchChildren =
    branchStep && isBranchStep(branchStep) && branch
      ? branchStep.inputs?.children?.[branch.id] || []
      : []
  $: branchSelection =
    branchContext && branch
      ? {
          nodeId: `branch-${branchContext.branchStepId}-${branchContext.branchIdx}-${branch.id}`,
          stepId: branchContext.branchStepId,
          branchIdx: branchContext.branchIdx,
        }
      : undefined
  $: branchPath =
    branchStepRef && branchSelection
      ? (branchStepRef.pathTo.concat({
          stepIdx: 0,
          branchIdx: branchSelection.branchIdx,
          branchStepId: branchSelection.stepId,
          id: branchSelection.stepId,
        }) as FlowBlockPath)
      : undefined
  $: isActiveInsertionPoint =
    getActionTargetKey($automationStore.actionPanelBlock) ===
    getActionTargetKey(block)

  const getActionTargetKey = (value: unknown) => {
    if (!value || typeof value !== "object") {
      return undefined
    }

    const target = value as Record<string, unknown>
    if (target.insertIntoLoopV2) {
      return [
        "loop",
        target.loopStepId || target.id,
        target.loopChildInsertIndex,
      ].join(":")
    }

    if (target.branchNode) {
      return ["branch", target.branchStepId, target.branchIdx].join(":")
    }

    return typeof target.id === "string" ? `step:${target.id}` : undefined
  }

  const isBranchContext = (value: unknown): value is BranchFlowContext => {
    return (
      !!value &&
      typeof value === "object" &&
      "branchNode" in value &&
      value.branchNode === true
    )
  }

  const deleteBranch = async () => {
    if (!branchSelection) {
      return
    }
    if (branchChildren.length) {
      branchDeleteDialog?.show(branchSelection)
      return
    }
    if (!branchPath || !$selectedAutomation.data) {
      return
    }
    await automationStore.actions.deleteBranch(
      branchPath,
      $selectedAutomation.data
    )
    await automationStore.actions.selectNode()
  }
</script>

<div class="action-bar" class:active-insertion-point={isActiveInsertionPoint}>
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
  {#if branchContext && canDeleteBranch}
    <Icon
      hoverable
      name="trash"
      on:click={deleteBranch}
      tooltipType={TooltipType.Info}
      tooltipPosition={TooltipPosition.Right}
      tooltip={"Delete branch"}
      size="S"
      color="var(--automation-flow-action-icon-color)"
      hoverColor="var(--automation-flow-action-icon-hover-color)"
    />
  {/if}
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
