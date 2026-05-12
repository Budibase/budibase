<script lang="ts">
  import StepNode from "./StepNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import { ViewMode, type StepNodeData } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { enrichLog } from "../../AutomationStepHelpers"
  import {
    type AutomationStep,
    type AutomationTrigger,
    type AutomationStepResult,
    type AutomationTriggerResult,
  } from "@budibase/types"

  export let data: StepNodeData

  $: block = data.block
  $: viewMode = $automationStore.viewMode
  $: automation = $selectedAutomation?.data
  $: isTrigger = "type" in block && block.type === "TRIGGER"

  // TODO: Fix Casting this temporarily
  // Don't want to drill down into the block types here
  $: stepBlock = block as AutomationStep | AutomationTrigger

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

<div class="step-wrapper">
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
</style>
