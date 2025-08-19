<script lang="ts">
  import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "@xyflow/svelte"
  import { selectedAutomation, automationStore } from "@/stores/builder"
  import FlowItemActions from "./FlowItemActions.svelte"
  import { ActionButton } from "@budibase/bbui"
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
  $: isBranchTarget = edgeTarget?.startsWith("branch-")
  $: path = edgeTarget.startsWith("anchor-")
    ? getBezierPath({
        ...($$props as any),
        targetX: labelX,
        targetY: labelY,
      })
    : basePath

  // Get block reference from automation store
  $: blockRefs = $selectedAutomation?.blockRefs?.[block?.id]
  $: pathSteps =
    blockRefs && automation
      ? automationStore.actions.getPathSteps(blockRefs.pathTo, automation)
      : []

  $: collectBlockExists = pathSteps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
  $: isPrimaryBranchEdge =
    $$props.data?.isBranchEdge && $$props.data?.isPrimaryEdge
  $: showActions =
    !!block &&
    viewMode === ViewMode.EDITOR &&
    (!isBranchTarget || isPrimaryBranchEdge)
</script>

<BaseEdge path={path[0]} />
<EdgeLabelRenderer>
  <div
    class="add-item-label nodrag nopan"
    style="transform:translate(-50%, -50%) translate({labelX}px,{labelY}px);"
  >
    {#if !collectBlockExists && showActions}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="actions-stack"
        on:mousedown|stopPropagation
        on:click|stopPropagation
      >
        <FlowItemActions
          {block}
          on:branch={() => {
            const explicitTargetRef =
              isBranchTarget && $$props.data?.branchStepId
                ? $selectedAutomation?.blockRefs?.[$$props.data.branchStepId]
                : null
            const targetPath = explicitTargetRef?.pathTo || blockRefs?.pathTo
            if (targetPath && automation) {
              automationStore.actions.branchAutomation(targetPath, automation)
            }
          }}
        />
        {#if isPrimaryBranchEdge}
          {#if $selectedAutomation?.blockRefs?.[$$props.data?.branchStepId]}
            <div
              class="branch-controls"
              on:mousedown|stopPropagation
              on:click|stopPropagation
            >
              <ActionButton
                icon="plus-circle"
                disabled={viewMode === ViewMode.LOGS}
                on:click={() => {
                  const targetRef =
                    $selectedAutomation.blockRefs[$$props.data.branchStepId]
                  if (targetRef && automation) {
                    automationStore.actions.branchAutomation(
                      targetRef.pathTo,
                      automation
                    )
                  }
                }}
              >
                Add branch
              </ActionButton>
            </div>
          {/if}
        {/if}
      </div>
    {/if}
  </div>
</EdgeLabelRenderer>

<style>
  .add-item-label {
    position: absolute;
    z-index: 123;
    color: white;
    pointer-events: all;
    cursor: default;
  }
  .actions-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: all;
  }
  .branch-controls :global(.spectrum-ActionButton) {
    margin-top: 4px;
    cursor: pointer;
  }
</style>
