<script lang="ts">
  import BranchNode from "./BranchNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { enrichLog } from "./AutomationStepHelpers"
  import {
    type AutomationStepResult,
    type AutomationTriggerResult,
  } from "@budibase/types"

  export let data

  // unwrap data passed from SvelteFlow
  $: block = data.block
  // branch object is available as data.branch but not needed here
  $: branchIdx = data.branchIdx
  $: viewMode = data?.viewMode as ViewMode
  $: automation = $selectedAutomation?.data

  // Handle step selection in logs mode (open details panel)
  function handleStepSelect(
    stepData: AutomationStepResult | AutomationTriggerResult
  ) {
    if (
      stepData &&
      viewMode === ViewMode.LOGS &&
      $automationStore.selectedLog
    ) {
      const enriched =
        enrichLog(
          $automationStore.blockDefinitions,
          $automationStore.selectedLog
        ) ?? $automationStore.selectedLog
      automationStore.actions.openLogPanel(enriched, stepData)
    }
  }
</script>

<div style="position: relative;">
  <Handle type="target" position={Position.Top} />
  <div class="branch-container">
    <BranchNode
      {automation}
      step={block}
      {branchIdx}
      {viewMode}
      onStepSelect={() => handleStepSelect(block)}
    />
  </div>
  <Handle type="source" position={Position.Bottom} />
</div>
