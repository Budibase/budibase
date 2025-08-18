<script lang="ts">
  import FlowItem from "./FlowItem.svelte"
  import { ViewMode } from "@/types/automations"
  import {
    AutomationActionStepId,
    type AutomationLog,
    type Automation,
    type AutomationStep,
    type AutomationTrigger,
    type BranchStepInputs,
    type AutomationStepResult,
    type AutomationTriggerResult,
  } from "@budibase/types"
  import { selectedAutomation } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import { memo } from "@budibase/frontend-core"
  import { getContext } from "svelte"

  export let step: AutomationStep | AutomationTrigger
  export let automation: Automation | undefined
  export let logData: AutomationLog | null = null
  export let viewMode: ViewMode.EDITOR | ViewMode.LOGS = ViewMode.EDITOR
  export let selectedLogStepId: string | null = null
  export let onStepSelect: (
    data: AutomationStepResult | AutomationTriggerResult
  ) => void = () => {}
  const memoEnvVariables = memo($environment.variables)
  const view = getContext("draggableView")

  let stepEle

  $: memoEnvVariables.set($environment.variables)
  $: blockRef = $selectedAutomation?.blockRefs?.[step.id]
  $: pathToCurrentNode = blockRef?.pathTo
  $: isBranch = step.stepId === AutomationActionStepId.BRANCH
  $: branches = (step.inputs as BranchStepInputs)?.branches || []

  // Log execution state
  $: logStepData = getLogStepData(logData, step)

  // For branch steps in logs mode, determine which branch was executed
  $: executedBranchId =
    isBranch && viewMode === ViewMode.LOGS && logStepData?.outputs?.branchId
      ? logStepData.outputs.branchId
      : null

  $: isBranchUnexecuted =
    isBranch && viewMode === ViewMode.LOGS && !logStepData?.outputs?.branchId

  function getLogStepData(
    logData: AutomationLog | null,
    step: AutomationStep | AutomationTrigger
  ) {
    if (!logData || viewMode !== ViewMode.LOGS) return null
    // For trigger step
    if (step.type === "TRIGGER") {
      return logData.trigger
    }

    // For action steps, find by unique id match
    const logSteps = logData.steps || []
    return logSteps.find(logStep => logStep.id === step.id)
  }
</script>

{#if !isBranch}
  <div class="block" bind:this={stepEle}>
    <FlowItem
      block={step}
      {blockRef}
      {automation}
      draggable={step.type !== "TRIGGER"}
      {logStepData}
      {viewMode}
      {selectedLogStepId}
      {onStepSelect}
      unexecuted={isBranchUnexecuted}
    />
  </div>
{/if}
