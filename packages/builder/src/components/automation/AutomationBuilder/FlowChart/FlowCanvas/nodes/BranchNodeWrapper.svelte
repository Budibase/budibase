<script lang="ts">
  import BranchNode from "./BranchNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import { ViewMode, type BranchNodeData } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { enrichLog } from "../../AutomationStepHelpers"
  import { STEP, SUBFLOW } from "../FlowGeometry"
  import {
    type AutomationStepResult,
    type AutomationTriggerResult,
  } from "@budibase/types"

  export let data: BranchNodeData
  const layoutDirection = getContext<Writable<"LR" | "TB">>(
    "flowLayoutDirection"
  )

  // unwrap data passed from SvelteFlow
  $: block = data.block
  $: branchIdx = data.branchIdx
  $: viewMode = $automationStore.viewMode as ViewMode
  $: automation = $selectedAutomation?.data
  $: isSubflow = !!data?.isSubflow
  $: laneWidth = data?.laneWidth || SUBFLOW.laneWidth
  $: handleOffset = isSubflow
    ? Math.max(0, Math.round((laneWidth - STEP.width) / 2))
    : 0
  $: isVertical = $layoutDirection === "TB"
  $: targetPosition = isVertical ? Position.Top : Position.Left
  $: sourcePosition = isVertical ? Position.Bottom : Position.Right
  $: targetHandleStyle =
    isSubflow && !isVertical ? `left: ${handleOffset - 3}px;` : undefined
  $: sourceHandleStyle =
    isSubflow && !isVertical ? `right: ${handleOffset - 3}px;` : undefined

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
    position={targetPosition}
    style={targetHandleStyle}
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
    position={sourcePosition}
    style={sourceHandleStyle}
  />
</div>
