<script lang="ts">
  import StepNode from "./StepNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import { ViewMode, type StepNodeData } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { enrichLog, getLogStepData } from "../../AutomationStepHelpers"
  import {
    type AutomationStep,
    type AutomationTrigger,
    type AutomationStepResult,
    type AutomationTriggerResult,
  } from "@budibase/types"
  import {
    didStepRun,
    didRunStopWithoutBranchMatch,
    getRunHighlight,
    isTerminalFailure,
  } from "../FlowRunHelpers"

  export let data: StepNodeData

  $: block = data.block
  $: viewMode = $automationStore.viewMode
  $: automation = $selectedAutomation?.data
  $: isTrigger = "type" in block && block.type === "TRIGGER"

  // TODO: Fix Casting this temporarily
  // Don't want to drill down into the block types here
  $: stepBlock = block as AutomationStep | AutomationTrigger
  $: logStepData =
    viewMode === ViewMode.LOGS
      ? getLogStepData(stepBlock, $automationStore.selectedLog)
      : null
  $: result =
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
  $: runStoppedWithoutBranchMatch = didRunStopWithoutBranchMatch(
    viewMode === ViewMode.LOGS
      ? $automationStore.selectedLog
      : $automationStore.testResults
  )
  $: handleStopped =
    !!result &&
    didStepRun(result) &&
    (runHighlight === "stopped" || runStoppedWithoutBranchMatch)
  $: handleError = isTerminalFailure(result) && !handleStopped
  $: handleSuccess =
    !handleError && !!result && didStepRun(result) && runHighlight === "success"

  function handleStepSelect(
    stepData: AutomationStepResult | AutomationTriggerResult
  ) {
    if (
      stepData &&
      viewMode === ViewMode.LOGS &&
      $automationStore.selectedLog
    ) {
      const enrichedLog =
        enrichLog(
          $automationStore.blockDefinitions,
          $automationStore.selectedLog
        ) ?? $automationStore.selectedLog
      automationStore.actions.openLogPanel(enrichedLog, stepData)
    }
  }
</script>

<div
  class="step-wrapper"
  class:error={handleError}
  class:success={handleSuccess}
  class:warn={handleStopped}
  class:logs={viewMode === ViewMode.LOGS}
>
  {#if !isTrigger}
    <Handle
      isConnectable={false}
      class="custom-handle"
      type="target"
      position={Position.Left}
    />
  {/if}
  <StepNode
    step={stepBlock}
    {automation}
    logData={$automationStore.selectedLog}
    {viewMode}
    selectedLogStepId={$automationStore.selectedLogStepData?.id}
    onStepSelect={block => handleStepSelect(block)}
  />
  <div class="xy-flow__handle">
    <Handle
      isConnectable={false}
      class="custom-handle"
      type="source"
      position={Position.Right}
    />
  </div>
</div>

<style>
  .step-wrapper {
    position: relative;
    width: fit-content;
    max-width: 360px;
  }
  .step-wrapper.error {
    --automation-flow-handle-color: var(
      --spectrum-semantic-negative-color-status
    );
  }
  .step-wrapper.success {
    --automation-flow-handle-color: var(
      --spectrum-semantic-positive-color-status
    );
  }
  .step-wrapper.warn {
    --automation-flow-handle-color: var(--spectrum-global-color-orange-500);
  }
  .step-wrapper.logs :global(.svelte-flow__handle-left.custom-handle),
  .step-wrapper.logs :global(.svelte-flow__handle-right.custom-handle) {
    top: 31px;
  }
</style>
