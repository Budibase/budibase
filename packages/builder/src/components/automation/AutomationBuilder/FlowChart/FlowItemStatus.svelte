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
    AutomationStatus,
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
  import { ActionButton, Icon } from "@budibase/bbui"
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
  export let showBlockType: boolean = true
  export let showFlowStatus: boolean = true
  export let iconOnly: boolean = false

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

    const outputStatus =
      outputs && "status" in outputs && typeof outputs.status === "string"
        ? outputs.status.toLowerCase()
        : undefined

    if (
      outputStatus === AutomationStatus.STOPPED ||
      outputStatus === AutomationStatus.STOPPED_ERROR
    ) {
      return {
        message: "Stopped",
        icon: "warning",
        type: FlowStatusType.WARN,
      }
    }

    if (branch && isBranchStep(block)) {
      const branchStatus = getBranchFlowStatus(outputs, block.inputs?.branches)
      if (branchStatus !== undefined) {
        return branchStatus ?? undefined
      }

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

  const getBranchFlowStatus = (
    outputs:
      | AutomationStepResult["outputs"]
      | AutomationTriggerResult["outputs"],
    branches: Branch[] | undefined
  ): FlowItemStatus | null | undefined => {
    if (!outputs || !branch || !branches || !("branchId" in outputs)) {
      return
    }

    const executedBranchIdx = branches.findIndex(
      stepBranch => stepBranch.id === outputs.branchId
    )
    const currentBranchIdx = branches.findIndex(
      stepBranch => stepBranch.id === branch.id
    )

    if (executedBranchIdx === -1 || currentBranchIdx === -1) {
      return
    }

    if (currentBranchIdx < executedBranchIdx) {
      return {
        message: "Stopped",
        icon: "warning",
        type: FlowStatusType.WARN,
      }
    }

    if (currentBranchIdx > executedBranchIdx) {
      return null
    }

    return {
      message: "Completed",
      icon: "CheckmarkCircle",
      type: FlowStatusType.SUCCESS,
    }
  }
</script>

<div class="flow-item-status">
  {#if blockRef || viewMode === ViewMode.LOGS}
    {#if showBlockType && blockRef?.looped && viewMode === ViewMode.EDITOR}
      <ActionButton size="S" active={false} icon="recycle">Looping</ActionButton
      >
    {:else}
      <span></span>
    {/if}
    {#if showFlowStatus && isRunning && !isTriggerBlock}
      {#if iconOnly}
        <span class="flow-blue flow-status-icon" title={runningLabel}>
          <Spinner size="12" />
        </span>
      {:else}
        <span class="flow-blue flow-running flow-status-btn">
          <ActionButton size="S" active={false}>
            <Spinner size="12" />
            {runningLabel}
          </ActionButton>
        </span>
      {/if}
    {:else if showFlowStatus && flowStatus && !hideStatus}
      {#if iconOnly}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
          class={`flow-${flowStatus.type} flow-status-icon`}
          title={flowStatus.message}
          on:click={async () => await onStatusClick(flowStatus.type)}
        >
          <Icon
            name={flowStatus.icon}
            size="S"
            weight="fill"
            color="currentColor"
          />
        </span>
      {:else if loopInfo?.total && $automationStore.inProgressTest}
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

  .flow-status-icon {
    width: 26px;
    height: 26px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--spectrum-global-color-gray-700);
    cursor: pointer;
  }

  .flow-status-icon :global(i) {
    font-size: 18px;
    width: 18px;
    height: 18px;
  }

  .flow-status-icon :global(svg) {
    width: 18px;
    height: 18px;
  }

  .flow-success.flow-status-icon {
    width: 18px;
    height: 18px;
    color: var(--spectrum-semantic-positive-color-status);
  }

  .flow-error.flow-status-icon {
    width: 18px;
    height: 18px;
    color: var(--spectrum-semantic-negative-color-status);
  }

  .flow-warn.flow-status-icon {
    width: 18px;
    height: 18px;
    position: relative;
    background-color: transparent;
    color: var(--spectrum-global-color-yellow-400);
  }

  .flow-warn.flow-status-icon::before {
    content: "";
    position: absolute;
    width: 16px;
    height: 15px;
    background-color: white;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }

  .flow-warn.flow-status-icon :global(i) {
    position: relative;
  }
</style>
