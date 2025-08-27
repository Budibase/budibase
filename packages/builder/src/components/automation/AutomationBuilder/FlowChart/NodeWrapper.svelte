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
  import StyleSection from "@/pages/builder/app/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/StyleSection.svelte"

  export let data

  // Extract block and other data
  $: block = data.block
  $: viewMode = data?.viewMode

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
    <div class="xy-flow__handle">
      <Handle type="target" position={Position.Top} />
    </div>
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
    <Handle type="source" position={Position.Bottom} />
  </div>
</div>

<style>
  .xy-flow__handle {
    opacity: 0;
    top: 0;
  }
</style>
