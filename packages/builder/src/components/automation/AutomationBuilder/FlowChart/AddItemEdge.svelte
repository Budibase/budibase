<script lang="ts">
  import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "@xyflow/svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import FlowItemActions from "./FlowItemActions.svelte"
  import { ActionStepID } from "@/constants/backend/automations"
  import { ViewMode } from "@/types/automations"

  export let target: string | undefined = undefined

  $: viewMode = $$props.data.viewMode
  $: block = $$props.data?.block
  $: automation = $selectedAutomation?.data

  // full path to compute label position
  $: basePath = getBezierPath($$props as any)
  $: labelX = basePath[1]
  $: labelY = basePath[2]

  // Only crop when the edge targets an anchor node
  $: edgeTarget = target ?? $$props.target
  $: path = edgeTarget.startsWith("anchor-")
    ? getBezierPath({
        ...($$props as any),
        targetX: labelX,
        targetY: labelY,
      })
    : basePath

  $: steps = automation?.definition?.steps ?? []
  $: blockIdx = steps.findIndex(step => step.id === block?.id)
  $: lastStep = !isTrigger && blockIdx + 1 === steps.length
  $: isTrigger = block?.type === "TRIGGER"

  // Get block reference from automation store
  $: blockRefs = $selectedAutomation?.blockRefs?.[block?.id]
  $: pathSteps =
    blockRefs && automation
      ? automationStore.actions.getPathSteps(blockRefs.pathTo, automation)
      : []

  $: collectBlockExists = pathSteps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
  $: console.log(viewMode)
</script>

<BaseEdge path={path[0]} />
<EdgeLabelRenderer>
  <div
    class="add-item-label"
    style="transform:translate(-50%, -50%) translate({labelX}px,{labelY}px);"
  >
    {#if !collectBlockExists && block && viewMode === ViewMode.EDITOR}
      <FlowItemActions
        {block}
        on:branch={() => {
          if (blockRefs && automation) {
            automationStore.actions.branchAutomation(
              blockRefs.pathTo,
              automation
            )
          }
        }}
      />
    {/if}
  </div>
</EdgeLabelRenderer>

<style>
  .add-item-label {
    position: absolute;
    z-index: 123;
    color: white;
  }
</style>
