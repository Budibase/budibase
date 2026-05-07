<script lang="ts">
  import { automationStore } from "@/stores/builder"
  import { ViewMode } from "@/types/automations"
  import {
    AutomationStepType,
    type Automation,
    type AutomationLog,
    type AutomationResults,
    type AutomationStep,
    type AutomationStepResult,
    type AutomationTrigger,
    type AutomationTriggerResult,
  } from "@budibase/types"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { getLogStepData } from "./AutomationStepHelpers"
  import type { DragView } from "./FlowCanvas/FlowChartDnD"
  import FlowItem from "./FlowItem.svelte"

  type FlowItemStatusResult =
    | AutomationStepResult
    | AutomationTriggerResult
    | undefined

  export let block: AutomationStep | AutomationTrigger
  export let automation: Automation | undefined
  export let logData: AutomationLog | null = null
  export let selectedLogStepId: string | null = null
  export let onStepSelect: (
    _data: AutomationStepResult | AutomationTriggerResult
  ) => void = () => {}

  const view = getContext<Writable<DragView>>("draggableView")

  $: logStepData = getLogStepData(block, logData)
  $: testStatusResult = automationStore.actions.processBlockResults(
    $automationStore.testResults,
    block
  ) as FlowItemStatusResult
  $: statusResult = logStepData || testStatusResult
  $: runResults =
    getRunResults($automationStore.selectedLog) ||
    getRunResults($automationStore.testResults)
  $: triggerCompleted =
    block.type === AutomationStepType.TRIGGER &&
    !$view?.dragging &&
    !!statusResult

  const getRunResults = (value: unknown): AutomationResults | undefined => {
    const isRunResults =
      !!value &&
      typeof value === "object" &&
      "steps" in value &&
      Array.isArray(value.steps) &&
      "trigger" in value &&
      !!value.trigger

    return isRunResults ? (value as AutomationResults) : undefined
  }
</script>

<FlowItem
  {block}
  {automation}
  draggable={block.type !== AutomationStepType.TRIGGER}
  {logStepData}
  {statusResult}
  {runResults}
  {triggerCompleted}
  viewMode={ViewMode.LOGS}
  {selectedLogStepId}
  {onStepSelect}
/>
