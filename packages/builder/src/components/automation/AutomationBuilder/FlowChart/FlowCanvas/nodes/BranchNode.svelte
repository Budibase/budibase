<script lang="ts">
  import FlowItemStatus from "../../FlowItemStatus.svelte"
  import {
    automationStore,
    selectedAutomation,
    contextMenuStore,
  } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { cloneDeep } from "lodash/fp"
  import { getContext } from "svelte"
  import { type Writable } from "svelte/store"
  import BlockHeader from "../../../../SetupPanel/BlockHeader.svelte"
  import { getLogStepData } from "../../AutomationStepHelpers"
  import type {
    Automation,
    AutomationStepResult,
    AutomationTriggerResult,
    Branch,
  } from "@budibase/types"
  import { type DragView } from "../FlowChartDnD"

  export let branchIdx
  export let step
  export let automation: Automation | undefined
  export let viewMode: ViewMode = ViewMode.EDITOR
  export let onStepSelect: (
    _data: AutomationStepResult | AutomationTriggerResult
  ) => void = () => {}

  const view = getContext<Writable<DragView>>("draggableView")
  $: branch = step.inputs?.branches?.[branchIdx]
  $: blockRef = $selectedAutomation?.blockRefs?.[step?.id]
  $: branchNodeId = branch ? createBranchNodeId(branchIdx, branch.id) : ""

  // Logs: compute step data and execution state
  $: logData = $automationStore.selectedLog
  $: viewMode = $automationStore.viewMode
  $: logStepData =
    viewMode === ViewMode.LOGS ? getLogStepData(step, logData) : null

  $: executedBranchId =
    viewMode === ViewMode.LOGS && logStepData?.outputs?.branchId
      ? logStepData.outputs.branchId
      : null
  $: executed = executedBranchId === branch?.id
  $: unexecuted =
    viewMode === ViewMode.LOGS && Boolean(executedBranchId) && !executed

  const createBranchNodeId = (idx: number, branchId: string) => {
    return `branch-${step.id}-${idx}-${branchId}`
  }

  const branchUpdate = async (e: CustomEvent<string>) => {
    let stepUpdate = cloneDeep(step)
    let branchUpdate = stepUpdate.inputs?.branches.find(
      (stepBranch: Branch) => stepBranch.id == branch.id
    )
    branchUpdate.name = e.detail

    if ($selectedAutomation.data) {
      const updatedAuto = automationStore.actions.updateStep(
        blockRef?.pathTo,
        $selectedAutomation.data,
        stepUpdate
      )
      if (updatedAuto) {
        await automationStore.actions.save(updatedAuto)
      }
    }
  }
</script>

<div class="flow-item branch">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class={`block branch-node hoverable`}
    class:selected={$automationStore.selectedNodeId === branchNodeId}
    class:executed
    class:unexecuted
    on:click={e => {
      e.stopPropagation()
      contextMenuStore.close()
      if (viewMode === ViewMode.LOGS && logStepData) {
        onStepSelect(logStepData)
      } else if (branch) {
        automationStore.actions.selectBranchNode({
          nodeId: branchNodeId,
          stepId: step.id,
          branchIdx,
        })
      }
    }}
  >
    <div class="block-float">
      <FlowItemStatus
        block={step}
        {branch}
        hideStatus={$view?.dragging}
        showBlockType={false}
      />
    </div>
    <div class="blockSection">
      <div class="heading">
        <BlockHeader
          {automation}
          block={step}
          itemName={branch.name}
          compact
          on:update={branchUpdate}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .branch-actions {
    display: flex;
    gap: var(--spacing-l);
    cursor: pointer;
  }
  .footer {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .flow-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .block-options {
    justify-content: flex-end;
    align-items: center;
    display: flex;
    gap: var(--spacing-m);
  }
  .center-items {
    display: flex;
    align-items: center;
  }
  .splitHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iconAlign {
    padding: 0 0 0 var(--spacing-m);
    display: inline-block;
  }
  .block {
    width: 180px;
    height: 120px;
    background-color: var(--background);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .blockSection {
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .separator {
    width: 1px;
    height: 25px;
    border-left: 1px dashed var(--grey-4);
    color: var(--grey-4);
    align-self: center;
  }

  .blockTitle {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .branch-node {
    position: relative;
  }

  .block-float {
    pointer-events: none;
    width: 100%;
    position: absolute;
    top: calc(100% + var(--spacing-xs));
    left: 0px;
  }

  .blockSection .heading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .block.selected {
    border-color: var(--spectrum-global-color-blue-700);
    transition: border-color 130ms ease-out;
  }

  .block.executed {
    border-color: var(--spectrum-global-color-green-600);
    border-width: 2px;
  }

  .block.unexecuted {
    opacity: 0.7;
  }
</style>
