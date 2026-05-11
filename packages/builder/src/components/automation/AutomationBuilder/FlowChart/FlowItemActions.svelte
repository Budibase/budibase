<script lang="ts">
  import { Icon, TooltipPosition, TooltipType } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "@/stores/builder"

  export let block

  $: blockRef = block?.id
    ? $selectedAutomation?.blockRefs?.[block.id]
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
