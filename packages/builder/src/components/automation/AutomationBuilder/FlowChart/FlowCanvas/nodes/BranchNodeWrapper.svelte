<script lang="ts">
  import BranchNode from "./BranchNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import type { ViewMode } from "@/types/automations"
  import { type BranchNodeData } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { STEP, SUBFLOW } from "../FlowGeometry"

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
</script>

<div
  class="branch-wrapper"
  style:--branch-wrapper-width={`${isSubflow ? laneWidth : STEP.width}px`}
>
  <Handle
    isConnectable={false}
    class="custom-handle"
    type="target"
    position={targetPosition}
    style={targetHandleStyle}
  />
  <div class="branch-container">
    <BranchNode {automation} step={block} {branchIdx} {viewMode} />
  </div>
  <Handle
    isConnectable={false}
    class="custom-handle"
    type="source"
    position={sourcePosition}
    style={sourceHandleStyle}
  />
</div>

<style>
  .branch-wrapper {
    position: relative;
    width: var(--branch-wrapper-width);
  }
  .branch-container {
    width: 200px;
    margin: 0 auto;
  }
</style>
