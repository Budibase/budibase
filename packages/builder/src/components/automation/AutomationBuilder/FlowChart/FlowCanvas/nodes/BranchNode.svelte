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
  import { type Automation, type Branch } from "@budibase/types"
  import { getRunHighlight } from "../FlowRunHelpers"
  import { type DragView } from "../FlowChartDnD"

  type BranchResult = {
    outputs: {
      branchId?: string
      success?: boolean
    }
  }

  export let branchIdx
  export let step
  export let automation: Automation | undefined
  export let viewMode: ViewMode = ViewMode.EDITOR

  const view = getContext<Writable<DragView>>("draggableView")
  const focusNodeRequest =
    getContext<Writable<{ nodeId: string; ensureVisible?: boolean } | null>>(
      "focusNodeRequest"
    )
  $: branch = step.inputs?.branches?.[branchIdx]
  $: blockRef = $selectedAutomation?.blockRefs?.[step?.id]
  $: branchNodeId = branch ? createBranchNodeId(branchIdx, branch.id) : ""
  $: selected = $automationStore.selectedNodeId === branchNodeId

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
  $: unexecuted = viewMode === ViewMode.LOGS && (!logStepData || !executed)
  $: branchResult =
    viewMode === ViewMode.LOGS
      ? logStepData
      : automationStore.actions.processBlockResults(
          $automationStore.testResults,
          step
        )
  $: branchExecuted =
    branch && hasBranchResult(branchResult)
      ? branchResult.outputs.branchId === branch.id
      : false
  $: runHighlight = getRunHighlight(
    viewMode === ViewMode.LOGS
      ? $automationStore.selectedLog
      : $automationStore.testResults
  )
  $: branchSuccess = branchExecuted && runHighlight === "success"
  $: branchFailed = branchExecuted && runHighlight === "error"
  $: branchStopped = branchExecuted && runHighlight === "stopped"

  const createBranchNodeId = (idx: number, branchId: string) => {
    return `branch-${step.id}-${idx}-${branchId}`
  }

  const hasBranchResult = (value: unknown): value is BranchResult => {
    if (!value || typeof value !== "object" || !("outputs" in value)) {
      return false
    }
    const outputs = value.outputs
    return !!outputs && typeof outputs === "object" && "branchId" in outputs
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
    class:selected
    class:success={branchSuccess}
    class:error={branchFailed}
    class:warn={branchStopped}
    class:executed
    class:unexecuted
    on:click={e => {
      e.stopPropagation()
      contextMenuStore.close()
      if (viewMode === ViewMode.LOGS) {
        return
      }
      if (branch) {
        automationStore.actions.selectBranchNode({
          nodeId: branchNodeId,
          stepId: step.id,
          branchIdx,
        })
        focusNodeRequest.set({ nodeId: branchNodeId, ensureVisible: true })
      }
    }}
  >
    <div class="block-float">
      <FlowItemStatus
        block={step}
        {branch}
        hideStatus={$view?.dragging}
        showBlockType={false}
        iconOnly
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
    width: fit-content;
    max-width: var(--automation-flow-item-max-width, 360px);
    background-color: var(--automation-flow-item-background, var(--background));
    border: 2px solid var(--spectrum-global-color-gray-200);
    border-radius: 16px;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .blockSection {
    padding: 0;
    padding-right: 20px;
    width: fit-content;
    max-width: 100%;
    height: auto;
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
    width: 26px;
    height: 26px;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(calc(-50% + 3px));
    z-index: 1;
  }

  .blockSection .heading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 0;
    height: 100%;
    cursor: pointer;
  }
  .blockSection .heading :global(.block-details.compact) {
    width: 100%;
    max-width: 100%;
    flex: 1 1 auto;
  }
  .blockSection .heading :global(.heading.compact) {
    flex: 1 1 auto;
  }

  .block.selected {
    border-color: var(--spectrum-global-color-blue-600);
    border-width: 2px;
  }

  .block.success {
    border-color: var(--spectrum-semantic-positive-color-status);
    border-width: 2px;
  }
  .block.error {
    border-color: var(--spectrum-semantic-negative-color-status);
    border-width: 2px;
  }

  .block.warn {
    border-color: var(--spectrum-global-color-orange-500);
    border-width: 2px;
  }

  .block.executed {
    border-color: var(--spectrum-semantic-positive-color-status);
    border-width: 2px;
  }

  .block.unexecuted {
    opacity: 0.7;
  }
</style>
