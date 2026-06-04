<script lang="ts">
  import BranchNode from "./BranchNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { type BranchNodeData } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { type BranchStep } from "@budibase/types"
  import { SUBFLOW } from "../FlowGeometry"
  import { getLogStepData } from "../../AutomationStepHelpers"
  import {
    didBranchStopWithoutMatch,
    getRunHighlight,
    isTerminalFailure,
  } from "../FlowRunHelpers"

  export let data: BranchNodeData

  // unwrap data passed from SvelteFlow
  $: block = data.block
  $: stepBlock = block as BranchStep
  $: branchIdx = data.branchIdx
  $: viewMode = $automationStore.viewMode as ViewMode
  $: automation = $selectedAutomation?.data
  $: isSubflow = !!data?.isSubflow
  $: laneWidth = data?.laneWidth || SUBFLOW.laneWidth
  $: targetHandleStyle = isSubflow ? "left: -3px;" : undefined
  $: sourceHandleStyle = isSubflow ? "right: -3px;" : undefined
  $: logData = $automationStore.selectedLog
  $: logStepData =
    viewMode === ViewMode.LOGS ? getLogStepData(stepBlock, logData) : null
  $: branchResult =
    viewMode === ViewMode.LOGS
      ? logStepData
      : automationStore.actions.processBlockResults(
          $automationStore.testResults,
          stepBlock
        )
  $: runHighlight = getRunHighlight(
    viewMode === ViewMode.LOGS
      ? $automationStore.selectedLog
      : $automationStore.testResults
  )
  $: hasBranchResultValue = hasBranchResult(branchResult)
  $: branchExecuted =
    branchIdx !== undefined && hasBranchResultValue
      ? branchResult.outputs.branchId ===
        stepBlock.inputs.branches?.[branchIdx]?.id
      : false
  $: branchStepFailed = isTerminalFailure(branchResult)
  $: branchStepFailure =
    branchStepFailed && (branchExecuted || !hasBranchResultValue)
  $: branchStoppedWithoutMatch = didBranchStopWithoutMatch(branchResult)
  $: branchError =
    !branchStoppedWithoutMatch &&
    runHighlight !== "stopped" &&
    (branchStepFailure || (branchExecuted && runHighlight === "error"))
  $: branchSuccess =
    !branchError && branchExecuted && runHighlight === "success"
  $: branchStopped =
    branchStoppedWithoutMatch ||
    (!branchError && branchExecuted && runHighlight === "stopped")

  type BranchResult = {
    outputs: {
      branchId?: string
      success?: boolean
    }
  }

  const hasBranchResult = (value: unknown): value is BranchResult => {
    if (!value || typeof value !== "object" || !("outputs" in value)) {
      return false
    }
    const outputs = value.outputs
    return !!outputs && typeof outputs === "object" && "branchId" in outputs
  }
</script>

<div
  class="branch-wrapper"
  class:subflow={isSubflow}
  class:error={branchError}
  class:success={branchSuccess}
  class:warn={branchStopped}
  class:logs={viewMode === ViewMode.LOGS}
  style:--branch-wrapper-width={`${laneWidth}px`}
>
  <Handle
    isConnectable={false}
    class="custom-handle"
    type="target"
    position={Position.Left}
    style={targetHandleStyle}
  />
  <div class="branch-container">
    <BranchNode {automation} step={block} {branchIdx} {viewMode} />
  </div>
  <Handle
    isConnectable={false}
    class="custom-handle"
    type="source"
    position={Position.Right}
    style={sourceHandleStyle}
  />
</div>

<style>
  .branch-wrapper {
    position: relative;
    width: fit-content;
    max-width: 360px;
  }
  .branch-wrapper.subflow {
    width: fit-content;
    max-width: 360px;
  }
  .branch-container {
    width: fit-content;
    max-width: 360px;
    margin: 0;
  }
  .branch-wrapper.error :global(.custom-handle) {
    background-color: var(--spectrum-semantic-negative-color-status);
  }
  .branch-wrapper.success :global(.custom-handle) {
    background-color: var(--spectrum-semantic-positive-color-status);
  }
  .branch-wrapper.warn :global(.custom-handle) {
    background-color: var(--spectrum-global-color-orange-500);
  }
  .branch-wrapper.logs :global(.svelte-flow__handle-left.custom-handle),
  .branch-wrapper.logs :global(.svelte-flow__handle-right.custom-handle) {
    top: 31px;
  }
</style>
