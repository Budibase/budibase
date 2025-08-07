<script lang="ts">
  import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "@xyflow/svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import FlowItemActions from "./FlowItemActions.svelte"
  import { ActionStepID } from "@/constants/backend/automations"
  import { ViewMode } from "@/types/automations"

  let { viewMode = ViewMode.EDITOR }: any = $$props

  $: block = $$props.data?.block
  $: automation = $selectedAutomation?.data

  $: path = getBezierPath($$props as any)
  $: steps = automation?.definition?.steps ?? []
  $: blockIdx = steps.findIndex(step => step.id === block?.id)
  $: lastStep = !isTrigger && blockIdx + 1 === steps.length
  $: isTrigger = block?.type === "TRIGGER"

  // Get block reference from automation store
  $: blockRef = $selectedAutomation?.blockRefs?.[block?.id]
  $: pathSteps =
    blockRef && automation
      ? automationStore.actions.getPathSteps(blockRef.pathTo, automation)
      : []

  $: collectBlockExists = pathSteps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
</script>

<BaseEdge path={path[0]} />
<EdgeLabelRenderer>
  <div
    class="add-item-label"
    style="transform:translate(-50%, -50%) translate({path[1]}px,{path[2]}px);"
  >
    {#if !collectBlockExists && block && $$props.viewMode === ViewMode.EDITOR}
      <FlowItemActions
        {block}
        on:branch={() => {
          if (blockRef && automation) {
            automationStore.actions.branchAutomation(
              blockRef.pathTo,
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
