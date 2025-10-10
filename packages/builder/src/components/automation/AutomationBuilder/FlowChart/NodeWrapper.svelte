<script lang="ts">
  import StepNode from "./StepNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { enrichLog } from "./AutomationStepHelpers"
  import {
    type AutomationStepResult,
    type AutomationTriggerResult,
  } from "@budibase/types"

  export let data

  // Extract block and other data
  $: block = data.block
  $: viewMode = $automationStore.viewMode
  $: direction = (data?.direction || "TB") as "TB" | "LR"
  $: isHorizontal = direction === "LR"

  // Get automation data from store
  $: automation = $selectedAutomation?.data
  $: isTrigger = block?.type === "TRIGGER"

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
    step={block}
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
