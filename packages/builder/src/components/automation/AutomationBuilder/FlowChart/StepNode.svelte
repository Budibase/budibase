<script lang="ts">
  import FlowItem from "./FlowItem.svelte"
  import { ViewMode } from "@/types/automations"
  import {
    AutomationActionStepId,
    type AutomationLog,
    type Automation,
    type AutomationStep,
    type AutomationTrigger,
    type AutomationStepResult,
    type AutomationTriggerResult,
  } from "@budibase/types"
  import { selectedAutomation } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import { memo } from "@budibase/frontend-core"

  export let step: AutomationStep | AutomationTrigger
  export let automation: Automation | undefined
  export let logData: AutomationLog | null = null
  export let viewMode: ViewMode.EDITOR | ViewMode.LOGS = ViewMode.EDITOR
  export let selectedLogStepId: string | null = null
  export let onStepSelect: (
    _data: AutomationStepResult | AutomationTriggerResult
  ) => void = () => {}
  const memoEnvVariables = memo($environment.variables)

  let stepEle

  $: memoEnvVariables.set($environment.variables)
  $: blockRef = $selectedAutomation?.blockRefs?.[step.id]
  $: isBranch = step.stepId === AutomationActionStepId.BRANCH

  // Log execution state
  $: logStepData = getLogStepData(logData, step)

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
    />
  </div>
{/if}
