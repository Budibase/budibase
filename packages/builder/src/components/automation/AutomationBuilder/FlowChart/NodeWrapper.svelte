<script lang="ts">
  import StepNode from "./StepNode.svelte"
  import { selectedAutomation } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import { Handle, Position } from "@xyflow/svelte"

  // Props from @xyflow/svelte - accept all expected props
  export let id
  export let data

  // Extract block and other data
  $: block = data.block

  // Get automation data from store
  $: automation = $selectedAutomation?.data
  $: isTrigger = block?.type === "TRIGGER"
</script>

<div style="position: relative;">
  {#if !isTrigger}
    <Handle type="target" position={Position.Top} />
  {/if}
  <StepNode
    step={block}
    {automation}
    isLast={false}
    logData={null}
    viewMode={ViewMode.EDITOR}
    selectedLogStepId={null}
    onStepSelect={() => {}}
  />
  {#if true}
    <Handle type="source" position={Position.Bottom} />
  {/if}
</div>
