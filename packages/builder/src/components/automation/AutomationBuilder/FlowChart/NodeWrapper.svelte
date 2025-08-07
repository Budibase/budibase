<script lang="ts">
  import StepNode from "./StepNode.svelte"
  import { selectedAutomation } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { getBlocks } from "./AutomationStepHelpers"
  import { Handle, Position } from "@xyflow/svelte"

  // Props from @xyflow/svelte - accept all expected props
  export let id
  export let data

  // Extract block and other data
  $: block = data.block

  // Get automation data from store
  $: automation = $selectedAutomation?.data
  $: blocks = automation ? getBlocks(automation, ViewMode.EDITOR) : []
  $: stepIdx = blocks.findIndex(b => b.id === id)
  $: isLast = stepIdx === blocks.length - 1
</script>

<div style="position: relative;">
  {#if stepIdx > 0}
    <Handle type="target" position={Position.Top} />
  {/if}
  <StepNode
    step={block}
    {stepIdx}
    {automation}
    {blocks}
    {isLast}
    logData={null}
    viewMode={ViewMode.EDITOR}
    selectedLogStepId={null}
    onStepSelect={() => {}}
  />
  {#if !isLast}
    <Handle type="source" position={Position.Bottom} />
  {/if}
</div>
