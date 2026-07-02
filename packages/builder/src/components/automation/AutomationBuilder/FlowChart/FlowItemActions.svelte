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
  $: isActiveInsertionPoint =
    getActionTargetKey($automationStore.actionPanelBlock) ===
    getActionTargetKey(block)

  const checkIsInsideBranchInLoop = (blockRef: BlockRef | undefined) => {
    if (!blockRef?.pathTo) return false
    for (const hop of blockRef.pathTo) {
      if (hop.loopStepId && Number.isInteger(hop.branchIdx)) {
        return true
      }
    }

    return false
  }

  const getActionTargetKey = (value: unknown) => {
    if (!value || typeof value !== "object") {
      return undefined
    }

    const target = value as Record<string, unknown>
    if (target.insertIntoLoopV2) {
      const branchKey =
        typeof target.branchStepId === "string" ||
        typeof target.branchIdx === "number"
          ? `branch:${target.branchStepId || ""}:${target.branchIdx ?? ""}`
          : "root"
      const sourceKey =
        typeof target.id === "string"
          ? `step:${target.id}`
          : target.branchNode
            ? branchKey
            : "unknown"

      return [
        "loop",
        target.loopStepId || target.id,
        target.loopChildInsertIndex,
        branchKey,
        sourceKey,
      ].join(":")
    }

    if (target.branchNode) {
      return ["branch", target.branchStepId, target.branchIdx].join(":")
    }

    return typeof target.id === "string" ? `step:${target.id}` : undefined
  }
</script>

<div class="action-bar" class:active-insertion-point={isActiveInsertionPoint}>
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
