<script lang="ts">
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import {
    type FlowItemStatus,
    DataMode,
    FilterableRowTriggers,
    FlowStatusType,
  } from "@/types/automations"
  import {
    type AutomationStep,
    type AutomationStepResult,
    type AutomationTrigger,
    type AutomationTriggerResult,
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

  export let block: AutomationStep | AutomationTrigger | undefined
  export let branch: Branch | undefined
  export let hideStatus: boolean | undefined = false

  $: blockRef = block?.id ? $selectedAutomation.blockRefs[block?.id] : null
  $: isTriggerBlock = block ? isTrigger(block) : false

  $: testResults = $automationStore.testResults as TestAutomationResponse
  $: blockResult = automationStore.actions.processBlockResults(
    testResults,
    block
  )
  $: flowStatus = getFlowStatus(blockResult)

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
    const isFilteredRowTrigger =
      isTriggerBlock &&
      isDidNotTriggerResponse(testResults) &&
      FilterableRowTriggers.includes(block.stepId as AutomationTriggerStepId)

    if (
      isFilteredRowTrigger ||
      (isFilterStep(block) && "result" in outputs && outputs.result === false)
    ) {
      return {
        message: "Stopped",
        icon: "Alert",
        type: FlowStatusType.WARN,
      }
    }

    if (branch && isBranchStep(block)) {
      // Do not give status markers to branch nodes that were not part of the run.
      if ("branchId" in outputs && outputs.branchId !== branch.id) return

      // Mark branches as stopped when no branch criteria was met
      if (outputs.success == false) {
        return {
          message: "Stopped",
          icon: "Alert",
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
  {#if blockRef}
    {#if isTriggerBlock}
      <span class="block-type">
        <ActionButton size="S" active={false} icon="Workflow">
          Trigger
        </ActionButton>
      </span>
    {:else if blockRef.looped}
      <ActionButton size="S" active={false} icon="Reuse">Looping</ActionButton>
    {:else}
      <span />
    {/if}
    {#if blockResult && flowStatus && !hideStatus}
      <span class={`flow-${flowStatus.type}`}>
        <ActionButton
          size="S"
          icon={flowStatus.icon}
          tooltip={flowStatus?.tooltip}
          on:click={async () => {
            if (branch || !block) {
              return
            }
            await automationStore.actions.selectNode(
              block?.id,
              flowStatus.type == FlowStatusType.SUCCESS
                ? DataMode.OUTPUT
                : DataMode.ERRORS
            )
          }}
        >
          {flowStatus.message}
        </ActionButton>
      </span>
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
  .flow-item-status :global(.spectrum-ActionButton),
  .flow-item-status :global(.spectrum-ActionButton .spectrum-Icon) {
    color: var(--spectrum-alias-text-color-hover);
  }
  .flow-success :global(.spectrum-ActionButton) {
    background-color: var(--spectrum-semantic-positive-color-status);
    border-color: var(--spectrum-semantic-positive-color-status);
  }
  .flow-error :global(.spectrum-ActionButton) {
    background-color: var(--spectrum-semantic-negative-color-status);
    border-color: var(--spectrum-semantic-negative-color-status);
  }
  .flow-warn :global(.spectrum-ActionButton) {
    background-color: var(--spectrum-global-color-gray-300);
    border-color: var(--spectrum-global-color-gray-300);
  }
  .flow-warn :global(.spectrum-ActionButton .spectrum-Icon) {
    color: var(--spectrum-global-color-yellow-600);
  }
</style>
