<script lang="ts">
  import BranchNode from "./BranchNode.svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import type { ViewMode } from "@/types/automations"
  import { type BranchNodeData } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import { STEP, SUBFLOW } from "../FlowGeometry"

  export let data: BranchNodeData

  // unwrap data passed from SvelteFlow
  $: block = data.block
  $: branchIdx = data.branchIdx
  $: viewMode = $automationStore.viewMode as ViewMode
  $: automation = $selectedAutomation?.data
  $: isSubflow = !!data?.isSubflow
  $: laneWidth = data?.laneWidth || SUBFLOW.laneWidth
  $: sourceHandleInset = Math.max(0, laneWidth - STEP.width)
  $: targetHandleStyle = isSubflow ? "left: -3px;" : undefined
  $: sourceHandleStyle = isSubflow
    ? `right: ${sourceHandleInset - 3}px;`
    : undefined
</script>

<div
  class="branch-wrapper"
  class:subflow={isSubflow}
  style:--branch-wrapper-width={`${laneWidth}px`}
>
  <Handle
    isConnectable={false}
    class="custom-handle"
    type="target"
    position={Position.Left}
    style={targetHandleStyle}
  />
  <div class="branch-container">
    <BranchNode {automation} step={block} {branchIdx} {viewMode} />
  </div>
  <Handle
    isConnectable={false}
    class="custom-handle"
    type="source"
    position={Position.Right}
    style={sourceHandleStyle}
  />
</div>

<style>
  .branch-wrapper {
    position: relative;
    width: fit-content;
    max-width: 360px;
  }
  .branch-wrapper.subflow {
    width: var(--branch-wrapper-width);
    max-width: var(--branch-wrapper-width);
  }
  .branch-container {
    width: fit-content;
    max-width: 360px;
    margin: 0;
  }
</style>
