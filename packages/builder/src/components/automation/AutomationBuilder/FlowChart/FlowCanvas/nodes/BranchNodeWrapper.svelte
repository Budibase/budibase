<script lang="ts">
  import BranchNode from "./BranchNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import { ViewMode, type BranchNodeData } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { enrichLog } from "../../AutomationStepHelpers"
  import { STEP, SUBFLOW } from "../FlowGeometry"
  import {
    type AutomationStepResult,
    type AutomationTriggerResult,
    type LayoutDirection,
  } from "@budibase/types"

  export let data: BranchNodeData

  // unwrap data passed from SvelteFlow
  $: block = data.block
  $: branchIdx = data.branchIdx
  $: viewMode = $automationStore.viewMode as ViewMode
  $: automation = $selectedAutomation?.data
  $: direction = (data.direction || "TB") as LayoutDirection
  $: isHorizontal = direction === "LR"
  $: isSubflow = !!data?.isSubflow
  $: laneWidth = data?.laneWidth || SUBFLOW.laneWidth
  $: handleOffset =
    isHorizontal && isSubflow
      ? Math.max(0, Math.round((laneWidth - STEP.width) / 2))
      : 0

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

<div class="branch-wrapper">
  <Handle
    isConnectable={false}
    class="custom-handle"
    type="target"
    position={isHorizontal ? Position.Left : Position.Top}
    style={isHorizontal && isSubflow
      ? `left: ${handleOffset - 3}px;`
      : undefined}
  />
  <div class="branch-container">
    <BranchNode
      {automation}
      step={block}
      {branchIdx}
      {viewMode}
      onStepSelect={handleStepSelect}
    />
  </div>
  <Handle
    isConnectable={false}
    class="custom-handle"
    type="source"
    position={isHorizontal ? Position.Right : Position.Bottom}
    style={isHorizontal && isSubflow
      ? `right: ${handleOffset - 3}px;`
      : undefined}
  />
</div>
