<script lang="ts">
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import {
    type FlowItemStatus,
    DataMode,
    FilterableRowTriggers,
    FlowStatusType,
    ViewMode,
  } from "@/types/automations"
  import {
    type AutomationStep,
    type AutomationStepResult,
    type AutomationTrigger,
    type AutomationTriggerResult,
    type AutomationJob,
    type Branch,
    type DidNotTriggerResponse,
    type TestAutomationResponse,
    type AutomationTriggerStepId,
    isDidNotTriggerResponse,
    isTrigger,
    isBranchStep,
    isFilterStep,
  } from "@budibase/types"
  import { ActionButton } from "@budibase/bbui"
  import Spinner from "@/components/common/Spinner.svelte"

  type StatusResult =
    | AutomationTriggerResult
    | AutomationStepResult
    | DidNotTriggerResponse
    | undefined

  export let block: AutomationStep | AutomationTrigger | undefined
  export let branch: Branch | undefined
  export let hideStatus: boolean | undefined = false
  export let logStepData:
    | AutomationStepResult
    | AutomationTriggerResult
    | null = null
  export let viewMode: ViewMode = ViewMode.EDITOR

  $: blockRef = block?.id ? $selectedAutomation.blockRefs[block?.id] : null
  $: viewMode = $automationStore.viewMode
  $: isLogsMode = viewMode === ViewMode.LOGS
  $: isTriggerBlock = block ? isTrigger(block) : false
  $: testResults = $automationStore.testResults as TestAutomationResponse
  $: progressResult =
    viewMode !== ViewMode.LOGS && block
      ? $automationStore.testProgress?.[block.id]?.result
      : null

  const isAutomationJob = (value: unknown): value is AutomationJob => {
    if (!value || typeof value !== "object") {
      return false
    }
    return "data" in value && "opts" in value
  }

  const toStatusResult = (value: unknown): StatusResult => {
    if (!value || isAutomationJob(value)) {
      return
    }
    return value as StatusResult
  }

  $: blockResult = toStatusResult(
    isLogsMode && logStepData
      ? logStepData
      : progressResult
        ? progressResult
        : automationStore.actions.processBlockResults(testResults, block)
  )

  $: isRunning =
    viewMode !== ViewMode.LOGS &&
    !!block &&
    $automationStore.inProgressTest &&
    $automationStore.testProgress?.[block.id]?.status === "running" &&
    (!branch ||
      !isBranchStep(block) ||
      (() => {
        const progress = $automationStore.testProgress?.[block.id]?.result
        if (!progress || typeof progress !== "object") {
          return false
        }
        if (!("outputs" in progress)) {
          return false
        }
        const outputs = progress.outputs
        if (!outputs || typeof outputs !== "object") {
          return false
        }
        if (!("branchId" in outputs)) {
          return false
        }
        return outputs.branchId === branch.id
      })())

  $: loopInfo =
    viewMode !== ViewMode.LOGS && block
      ? $automationStore.testProgress?.[block.id]?.loop
      : undefined

  $: runningLabel =
    loopInfo && loopInfo.total
      ? `Running (${loopInfo.current}/${loopInfo.total})`
      : "Running"

  $: completedLoopLabel =
    loopInfo && loopInfo.total && flowStatus
      ? `${flowStatus.message} ${loopInfo.current}/${loopInfo.total}`
      : flowStatus?.message

  $: triggerAlwaysCompleted =
    !isLogsMode &&
    !!block &&
    isTriggerBlock &&
    !!$automationStore.inProgressTest

  $: flowStatus = triggerAlwaysCompleted
    ? {
        message: "Completed",
        icon: "CheckmarkCircle",
        type: FlowStatusType.SUCCESS,
      }
    : getFlowStatus(blockResult)

  const onStatusClick = async (status: FlowStatusType) => {
    if (branch || !block || isLogsMode) {
      return
    }
    await automationStore.actions.selectNode(
      block?.id,
      status === FlowStatusType.SUCCESS ? DataMode.OUTPUT : DataMode.ERRORS
    )
  }

  const getFlowStatus = (
    result?:
      | AutomationTriggerResult
      | AutomationStepResult
      | DidNotTriggerResponse
  ): FlowItemStatus | undefined => {
    if (!result || !block) {
      return
    }
    const outputs = result?.outputs

    // Only check for filtered row triggers when we have test results, not log data
    const isFilteredRowTrigger =
      !isLogsMode &&
      isTriggerBlock &&
      testResults &&
      isDidNotTriggerResponse(testResults) &&
      FilterableRowTriggers.includes(block.stepId as AutomationTriggerStepId)

    if (
      isFilteredRowTrigger ||
      (isFilterStep(block) &&
        outputs &&
        "result" in outputs &&
        outputs.result === false)
    ) {
      return {
        message: "Stopped",
        icon: "warning",
        type: FlowStatusType.WARN,
      }
    }

    if (branch && isBranchStep(block)) {
      // Do not give status markers to branch nodes that were not part of the run.
      if (outputs && "branchId" in outputs && outputs.branchId !== branch.id)
        return

      // Mark branches as stopped when no branch criteria was met
      if (outputs && outputs.success == false) {
        return {
          message: "Stopped",
          icon: "warning",
          type: FlowStatusType.WARN,
        }
      }
    }

    const success = outputs?.success || isTriggerBlock
    return {
      message: success ? "Completed" : "Failed",
      icon: success ? "CheckmarkCircle" : "AlertCircleFilled",
      type:
        success || isTriggerBlock
          ? FlowStatusType.SUCCESS
          : FlowStatusType.ERROR,
    }
  }
</script>

<div class="flow-item-status">
  {#if blockRef || viewMode === ViewMode.LOGS}
    {#if isTriggerBlock}
      <span class="block-type">
        <ActionButton size="S" active={false} icon="tree-structure">
          Trigger
        </ActionButton>
      </span>
    {:else if blockRef?.looped && viewMode === ViewMode.EDITOR}
      <ActionButton size="S" active={false} icon="recycle">Looping</ActionButton
      >
    {:else}
      <span></span>
    {/if}
    {#if isRunning && !isTriggerBlock}
      <span class="flow-blue flow-running flow-status-btn">
        <ActionButton size="S" active={false}>
          <Spinner size="12" />
          {runningLabel}
        </ActionButton>
      </span>
    {:else if flowStatus && !hideStatus}
      {#if loopInfo?.total && $automationStore.inProgressTest}
        <span class="flow-success flow-status-btn">
          <ActionButton
            size="S"
            icon={flowStatus.icon}
            tooltip={flowStatus?.tooltip}
            on:click={async () => await onStatusClick(flowStatus.type)}
          >
            {completedLoopLabel}
          </ActionButton>
        </span>
      {:else if viewMode === ViewMode.LOGS}
        <span class={`flow-${flowStatus.type} flow-status-btn`}>
          <ActionButton
            size="S"
            icon={flowStatus.icon}
            tooltip={flowStatus?.tooltip}
          >
            {flowStatus.message}
          </ActionButton>
        </span>
      {:else}
        <span class={`flow-${flowStatus.type} flow-status-btn`}>
          <ActionButton
            size="S"
            icon={flowStatus.icon}
            tooltip={flowStatus?.tooltip}
            on:click={async () => await onStatusClick(flowStatus.type)}
          >
            {flowStatus.message}
          </ActionButton>
        </span>
      {/if}
    {/if}
  {/if}
</div>

<style>
  .flow-item-status {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-s);
    align-items: center;
    pointer-events: none;
  }
  .flow-item-status :global(> *) {
    pointer-events: all;
  }
  .flow-item-status .block-type {
    pointer-events: none;
  }

  .flow-blue :global(.spectrum-ActionButton) {
    background-color: var(--spectrum-global-color-blue-600);
    border-color: var(--spectrum-global-color-blue-600);
  }

  .flow-success :global(.spectrum-ActionButton) {
    background-color: var(--spectrum-semantic-positive-color-status);
    border-color: var(--spectrum-semantic-positive-color-status);
  }
  .flow-running {
    margin-bottom: -5px;
  }
  .flow-running :global(.spectrum-ActionButton-label) {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    line-height: 1;
  }
  .flow-running :global(.spinner-container) {
    display: inline-flex;
    align-items: center;
  }
  .flow-error :global(.spectrum-ActionButton) {
    background-color: var(--spectrum-semantic-negative-color-status);
    border-color: var(--spectrum-semantic-negative-color-status);
  }
  .flow-warn :global(.spectrum-ActionButton) {
    background-color: var(--spectrum-global-color-gray-300);
    border-color: var(--spectrum-global-color-gray-300);
  }
  .flow-warn :global(.spectrum-ActionButton i) {
    color: var(--spectrum-global-color-yellow-600);
  }

  .flow-status-btn :global(.spectrum-ActionButton i) {
    color: unset;
  }
</style>
