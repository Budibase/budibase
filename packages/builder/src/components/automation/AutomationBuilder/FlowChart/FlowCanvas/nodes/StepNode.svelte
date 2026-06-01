<script lang="ts">
  import FlowItem from "../../FlowItem.svelte"
  import LogFlowItem from "../../LogFlowItem.svelte"
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
  import { environment } from "@/stores/portal"
  import { memo } from "@budibase/frontend-core"
  import { automationStore } from "@/stores/builder"

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
  $: isBranch = step.stepId === AutomationActionStepId.BRANCH
  $: viewMode = $automationStore.viewMode
</script>

{#if !isBranch}
  <div class="block" bind:this={stepEle}>
    {#if viewMode === ViewMode.LOGS}
      <LogFlowItem
        block={step}
        {automation}
        {logData}
        {selectedLogStepId}
        {onStepSelect}
      />
    {:else}
      <FlowItem
        block={step}
        {automation}
        draggable={step.type !== "TRIGGER"}
        {viewMode}
      />
    {/if}
  </div>
{/if}
