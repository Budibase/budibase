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
    type LayoutDirection,
  } from "@budibase/types"

  export let data: StepNodeData

  // Extract block and other data
  $: block = data.block
  $: viewMode = $automationStore.viewMode
  $: direction = (data.direction || "TB") as LayoutDirection
  $: isHorizontal = direction === "LR"

  // Get automation data from store
  $: automation = $selectedAutomation?.data
  $: isTrigger = "type" in block && block.type === "TRIGGER"

  // TODO: Fix Casting this temporarily
  // Don't want to drill down into the block types here
  $: stepBlock = block as AutomationStep | AutomationTrigger

  function handleStepSelect(
    stepData: AutomationStepResult | AutomationTriggerResult
  ) {
    // Show step details when a step is selected in logs mode
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

<div style="position: relative;">
  {#if !isTrigger}
    <Handle
      isConnectable={false}
      class="custom-handle"
      type="target"
      position={isHorizontal ? Position.Left : Position.Top}
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
      position={isHorizontal ? Position.Right : Position.Bottom}
    />
  </div>
</div>
