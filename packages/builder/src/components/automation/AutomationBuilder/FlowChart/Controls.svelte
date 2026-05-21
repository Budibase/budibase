<script lang="ts">
  import { Icon, TooltipPosition, TooltipType } from "@budibase/bbui"
  import { useSvelteFlow } from "@xyflow/svelte"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { isBranchStep } from "@budibase/types"
  import type { HistoryStore } from "@/stores/builder/history"
  import type { Automation } from "@budibase/types"

  export let historyStore: HistoryStore<Automation>

  const flow = useSvelteFlow()

  const openAddStepPanel = () => {
    if ($automationStore.viewMode !== ViewMode.EDITOR) {
      return
    }
    const automation = $selectedAutomation?.data
    const refs = $selectedAutomation?.blockRefs
    if (!automation || !refs) {
      return
    }

    const flowEnd = automationStore.actions.getToolbarFlowEndInsertion(
      automation,
      refs
    )
    const targetPath = flowEnd.targetPath
    const targetHop = targetPath.at(-1)
    const anchorRef = flowEnd.anchorRef

    if (anchorRef) {
      const anchorBlock = automationStore.actions.getBlockByRef(
        automation,
        anchorRef
      )
      automationStore.actions.openActionPanelToolbarFlowEnd(
        anchorBlock || anchorRef
      )
      return
    }

    const targetBranchIdx = targetHop?.branchIdx
    if (typeof targetBranchIdx === "number" && targetHop?.branchStepId) {
      const branchRef = refs[targetHop.branchStepId]
      const branchStep = automationStore.actions.getBlockByRef(
        automation,
        branchRef
      )
      if (branchStep && isBranchStep(branchStep)) {
        automationStore.actions.openActionPanelToolbarFlowEnd({
          branchNode: true,
          pathTo: targetPath,
          branchIdx: targetBranchIdx,
          branchStepId: targetHop.branchStepId,
        })
        return
      }
    }

    const triggerId = automation.definition.trigger.id
    const triggerRef = refs[triggerId]
    if (triggerRef) {
      automationStore.actions.openActionPanelToolbarFlowEnd(triggerRef)
    }
  }
</script>

<div class="controls">
  <div class="toolbar">
    <UndoRedoControl store={historyStore} showButtonGroup />
    <span class="fit-view-wrap">
      <Icon
        name="arrows-out"
        size="L"
        hoverable
        tooltip="Auto layout"
        tooltipPosition={TooltipPosition.Top}
        color="var(--spectrum-alias-text-color)"
        hoverColor="var(--spectrum-alias-text-color-hover)"
        on:click={() => flow.fitView()}
      />
    </span>
    {#if $automationStore.viewMode === ViewMode.EDITOR}
      <span class="add-step-wrap">
        <Icon
          name="plus"
          size="L"
          hoverable
          tooltip="Add a step"
          tooltipType={TooltipType.Info}
          tooltipPosition={TooltipPosition.Top}
          color="var(--spectrum-alias-text-color)"
          hoverColor="var(--spectrum-alias-text-color-hover)"
          on:click={openAddStepPanel}
        />
      </span>
    {/if}
  </div>
</div>

<style>
  .controls {
    position: absolute;
    z-index: 10;
    left: 50%;
    bottom: var(--spacing-l);
    transform: translateX(-50%);
  }

  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 6px 10px;
    border-radius: 9999px;
    background: var(--spectrum-global-color-gray-50);
    border: 1px solid var(--spectrum-global-color-gray-200);
    box-shadow:
      0 4px 14px rgba(0, 0, 0, 0.08),
      0 1px 2px rgba(0, 0, 0, 0.06);
  }

  :global(.spectrum--dark) .toolbar,
  :global(.spectrum--darkest) .toolbar,
  :global(.spectrum--midnight) .toolbar,
  :global(.spectrum--nord) .toolbar {
    background: var(--spectrum-global-color-gray-200);
    border-color: var(--spectrum-global-color-gray-300);
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.35),
      0 1px 2px rgba(0, 0, 0, 0.25);
  }

  /* Undo/redo: blend into pill (UndoRedoControl’s inner .group) */
  .toolbar :global(.undo-redo) {
    padding-right: 0;
  }

  .toolbar :global(.undo-redo .group) {
    border: none;
    border-radius: 0;
    overflow: visible;
    background: transparent;
    gap: var(--spacing-xs);
  }

  .toolbar :global(.undo-redo .group > *:not(:first-child)) {
    border-left: none !important;
  }

  /* One size; icon color follows Spectrum alias tokens (light / dark themes) */
  .toolbar :global(i.ph) {
    font-size: 20px !important;
    color: var(--spectrum-alias-text-color) !important;
  }

  .toolbar :global(.undo-redo .spectrum-ActionButton:hover:not(:disabled) i.ph),
  .toolbar :global(i.ph.hoverable:hover:not(.disabled)) {
    color: var(--spectrum-alias-text-color-hover) !important;
  }

  .toolbar :global(.undo-redo .spectrum-ActionButton:disabled i.ph) {
    color: var(--spectrum-alias-text-color-disabled) !important;
  }

  .toolbar :global(.undo-redo .spectrum-ActionButton),
  .toolbar :global(.undo-redo .spectrum-Button) {
    background: transparent !important;
    width: 36px;
    height: 36px;
    min-inline-size: 36px;
    min-block-size: 36px;
    padding: 0 !important;
    border-radius: 50% !important;
  }

  .toolbar :global(.undo-redo .spectrum-ActionButton:hover),
  .toolbar :global(.undo-redo .spectrum-Button:hover) {
    background: var(--spectrum-global-color-gray-200) !important;
    border-radius: 50% !important;
  }

  :global(.spectrum--dark)
    .toolbar
    :global(.undo-redo .spectrum-ActionButton:hover),
  :global(.spectrum--darkest)
    .toolbar
    :global(.undo-redo .spectrum-ActionButton:hover),
  :global(.spectrum--midnight)
    .toolbar
    :global(.undo-redo .spectrum-ActionButton:hover),
  :global(.spectrum--nord)
    .toolbar
    :global(.undo-redo .spectrum-ActionButton:hover) {
    background: var(--spectrum-global-color-gray-300) !important;
    border-radius: 50% !important;
  }

  .fit-view-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .fit-view-wrap:hover {
    background: var(--spectrum-global-color-gray-200);
    border-radius: 50%;
  }

  :global(.spectrum--dark) .fit-view-wrap:hover,
  :global(.spectrum--darkest) .fit-view-wrap:hover,
  :global(.spectrum--midnight) .fit-view-wrap:hover,
  :global(.spectrum--nord) .fit-view-wrap:hover {
    background: var(--spectrum-global-color-gray-300);
  }

  .add-step-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    /* Matches data-step icon tiles (FlowChart `.wrapper` --automation-step-icon-data-color) */
    background: var(--automation-step-icon-data-color);
  }

  .add-step-wrap:hover {
    background: color-mix(
      in srgb,
      var(--automation-step-icon-data-color) 88%,
      black
    );
    border-radius: 50%;
  }
</style>
