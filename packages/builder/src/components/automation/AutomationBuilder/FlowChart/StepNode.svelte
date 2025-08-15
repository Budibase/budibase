<script>
  import FlowItem from "./FlowItem.svelte"
  import { ViewMode } from "@/types/automations"
  import { AutomationActionStepId } from "@budibase/types"
  import { ActionButton, notifications } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import { cloneDeep } from "lodash"
  import { memo } from "@budibase/frontend-core"
  import { getContext, onMount } from "svelte"

  export let step = {}
  export let automation
  export let isLast = false
  export let logData = null
  export let viewMode = ViewMode.EDITOR
  export let selectedLogStepId = null
  export let onStepSelect = () => {}
  const memoEnvVariables = memo($environment.variables)
  const view = getContext("draggableView")

  let stepEle

  $: memoEnvVariables.set($environment.variables)
  $: blockRef = $selectedAutomation?.blockRefs?.[step.id]
  $: pathToCurrentNode = blockRef?.pathTo
  $: isBranch = step.stepId === AutomationActionStepId.BRANCH
  $: branches = step.inputs?.branches

  // Log execution state
  $: logStepData = getLogStepData(logData, step)

  // For branch steps in logs mode, determine which branch was executed
  $: executedBranchId =
    isBranch && viewMode === ViewMode.LOGS && logStepData?.outputs?.branchId
      ? logStepData.outputs.branchId
      : null

  $: isBranchUnexecuted =
    isBranch && viewMode === ViewMode.LOGS && !logStepData?.outputs?.branchId

  function getLogStepData(logData, step) {
    if (!logData || viewMode !== ViewMode.LOGS) return null

    // For trigger step
    if (step.type === "TRIGGER") {
      return logData.trigger
    }

    // For action steps, find by unique id match
    const logSteps = logData.steps || []
    return logSteps.find(logStep => logStep.id === step.id)
  }

  // All bindings available to this point
  $: availableBindings = automationStore.actions.getPathBindings(
    step.id,
    automation
  )

  // Fetch the env bindings
  $: environmentBindings =
    automationStore.actions.buildEnvironmentBindings($memoEnvVariables)

  $: userBindings = automationStore.actions.buildUserBindings()
  $: settingBindings = automationStore.actions.buildSettingBindings()
  $: stateBindings =
    ($automationStore.selectedNodeId,
    automationStore.actions.buildStateBindings())

  // Combine all bindings for the step
  $: bindings = [
    ...availableBindings,
    ...environmentBindings,
    ...userBindings,
    ...settingBindings,
    ...stateBindings,
  ]
</script>

{#if !isBranch}
  <div class="block" bind:this={stepEle}>
    <FlowItem
      block={step}
      {blockRef}
      {isLast}
      {automation}
      {bindings}
      draggable={step.type !== "TRIGGER"}
      {logStepData}
      {viewMode}
      {selectedLogStepId}
      {onStepSelect}
      unexecuted={isBranchUnexecuted}
    />
  </div>
{/if}

<style>
  .branch-wrap {
    width: inherit;
  }

  .branch {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    width: inherit;
  }

  /* Branch execution states in logs mode */

  .branch.unexecuted {
    opacity: 0.7;
  }

  .branch.unexecuted::before,
  .branch.unexecuted::after {
    opacity: 0.7;
  }

  .unexecuted {
    opacity: 0.7;
  }
</style>
