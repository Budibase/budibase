<script lang="ts">
  import StepNode from "./StepNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { enrichLog } from "./AutomationStepHelpers"

  export let id
  export let data

  // Extract block and other data
  $: block = data.block
  $: viewMode = data?.viewMode
  $: console.log(viewMode)
  // Get automation data from store
  $: automation = $selectedAutomation?.data
  $: isTrigger = block?.type === "TRIGGER"

  function handleStepSelect(stepData: any) {
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
    <Handle type="target" position={Position.Top} />
  {/if}
  <StepNode
    step={block}
    {automation}
    isLast={false}
    logData={$automationStore.selectedLog}
    {viewMode}
    selectedLogStepId={$automationStore.selectedLogStepData?.id}
    onStepSelect={handleStepSelect}
  />
  <Handle type="source" position={Position.Bottom} />
</div>
