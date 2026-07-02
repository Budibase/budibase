<script lang="ts">
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import {
    Icon,
    Body,
    AbsTooltip,
    StatusLight,
    Tags,
    Tag,
    TooltipType,
  } from "@budibase/bbui"
  import { externalActions } from "./ExternalActions"
  import { createEventDispatcher } from "svelte"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import {
    AutomationActionStepId,
    AutomationFeature,
    AutomationStepType,
    isTrigger as isTriggerBlock,
  } from "@budibase/types"
  import type {
    Automation,
    AutomationStep,
    AutomationStepResult,
    AutomationTrigger,
    AutomationTriggerResult,
  } from "@budibase/types"

  type TestResult = AutomationStepResult | AutomationTriggerResult

  export let block: AutomationStep | AutomationTrigger
  export let open: boolean
  export let showTestStatus = false
  export let testResult: TestResult | undefined = undefined
  export let isTrigger: boolean
  export let addLooping: () => void
  export let deleteStep: () => void
  export let enableNaming = true
  export let itemName: string | undefined = undefined
  export let automation: Automation | undefined = undefined

  let validRegex = /^[A-Za-z0-9_.\-\s]+$/
  let typing = false
  let editing = false
  const dispatch = createEventDispatcher()
  const minInputWidth = 10
  const maxInputWidth = 28

  $: blockRefs = $selectedAutomation?.blockRefs || {}
  $: stepNames = automation?.definition.stepNames || {}
  $: allSteps = automation?.definition.steps || []
  $: actionStepId = isTriggerBlock(block) ? undefined : block.stepId
  $: blockDefinition = actionStepId
    ? $automationStore.blockDefinitions.ACTION[actionStepId]
    : undefined
  $: restTemplateId =
    actionStepId === AutomationActionStepId.API_REQUEST
      ? getRestTemplateId(block.inputs)
      : undefined
  $: restTemplate = restTemplateId
    ? restTemplates.get(restTemplateId)
    : undefined
  $: automationName = itemName || stepNames?.[block.id] || block?.name || ""
  $: inputWidth = `${Math.min(
    Math.max(
      (automationName || `Enter ${isBranch ? "branch" : "step"} name`).length,
      minInputWidth
    ),
    maxInputWidth
  )}ch`
  $: automationNameError = getAutomationNameError(automationName)
  $: status = updateStatus(testResult)
  $: isHeaderTrigger = isTrigger || block.type === AutomationStepType.TRIGGER
  $: isBranch = block.stepId === "BRANCH"

  $: {
    if (!testResult) {
      const results = $automationStore.testResults
      const testSteps = results && "steps" in results ? results.steps : []
      testResult = testSteps?.filter((step: TestResult) =>
        block.id ? step.id === block.id : step.stepId === block.stepId
      )?.[0]
    }
  }

  $: blockRef = blockRefs[block.id]
  $: isLooped = blockRef?.looped

  async function onSelect(block: AutomationStep | AutomationTrigger) {
    automationStore.update(state => {
      return {
        ...state,
        selectedBlock: block,
      }
    })
  }

  function updateStatus(results?: TestResult) {
    if (!results) {
      return {}
    }
    const lcStatus = results.outputs?.status?.toLowerCase()
    if (lcStatus === "stopped" || lcStatus === "stopped_error") {
      return { yellow: true, message: "Stopped" }
    } else if (lcStatus === "suspended") {
      return { yellow: true, message: "Suspended" }
    } else if (results.outputs?.success || isTrigger) {
      return { positive: true, message: "Success" }
    } else {
      return { negative: true, message: "Error" }
    }
  }

  const getRestTemplateId = (inputs: object | void | undefined) => {
    if (
      inputs &&
      "restTemplateId" in inputs &&
      typeof inputs.restTemplateId === "string"
    ) {
      return inputs.restTemplateId
    }
  }

  const getAutomationNameError = (name: string) => {
    const duplicateError =
      "This name already exists, please enter a unique name"
    if (editing) {
      for (const [key, value] of Object.entries(stepNames)) {
        if (name !== block.name && name === value && key !== block.id) {
          return duplicateError
        }
      }

      for (const step of allSteps as AutomationStep[]) {
        if (step.id !== block.id && name === step.name) {
          return duplicateError
        }
      }
    }

    if (name !== block.name && name?.length > 0) {
      let invalidRoleName = !validRegex.test(name)
      if (invalidRoleName) {
        return "Please enter a name consisting of only alphanumeric characters, spaces, underscores, hyphens and periods"
      }
    }

    return null
  }

  const startEditing = () => {
    editing = true
    typing = true
  }

  const stopEditing = () => {
    editing = false
    typing = false
    if (automationNameError) {
      automationName = stepNames[block.id] || block?.name
    } else {
      dispatch("update", automationName)
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class:typing={typing && !automationNameError && editing}
  class:typing-error={automationNameError && editing}
  class="blockSection"
>
  <div class="splitHeader">
    <div class="center-items">
      {#if restTemplate?.icon}
        <div class="external-icon">
          <img alt={restTemplate.name} src={restTemplate.icon} />
        </div>
      {:else if actionStepId && externalActions[actionStepId]}
        <div class="external-icon">
          <img
            alt={externalActions[actionStepId].name}
            src={externalActions[actionStepId].icon}
          />
        </div>
      {:else}
        <Icon
          name={block.icon}
          size="M"
          color="var(--spectrum-global-color-gray-700)"
        />
      {/if}
      <div class="iconAlign">
        {#if isHeaderTrigger}
          <Body size="XS"><b>Trigger</b></Body>
        {:else}
          <Body size="XS">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <b>{isBranch ? "Branch" : "Step"}</b>
              {#if blockDefinition?.deprecated}
                <Tags>
                  <Tag invalid>Deprecated</Tag>
                </Tags>
              {/if}
            </div>
          </Body>
        {/if}

        {#if enableNaming}
          <input
            class="input-text"
            disabled={!enableNaming}
            placeholder={`Enter ${isBranch ? "branch" : "step"} name`}
            name="name"
            autocomplete="off"
            value={automationName}
            style:width={inputWidth}
            on:input={e => {
              automationName = e.currentTarget.value.trim()
            }}
            on:click={e => {
              e.stopPropagation()
              startEditing()
            }}
            on:keydown={async e => {
              if (e.key === "Enter") {
                await stopEditing()
              }
            }}
            on:blur={stopEditing}
          />
        {:else}
          <div class="input-text" style:width={inputWidth}>
            {automationName}
          </div>
        {/if}
      </div>
    </div>
    <div class="blockTitle">
      {#if showTestStatus && testResult}
        <div class="status-container">
          <div style="float:right;">
            <StatusLight
              positive={status?.positive}
              yellow={status?.yellow}
              negative={status?.negative}
            >
              <Body size="XS">{status?.message}</Body>
            </StatusLight>
          </div>
          <Icon
            on:click={e => {
              e.stopPropagation()
              dispatch("toggle")
            }}
            hoverable
            name={open ? "ChevronUp" : "ChevronDown"}
          />
        </div>
      {/if}
      <div
        class="context-actions"
        class:hide-context-actions={typing}
        on:click={() => {
          onSelect(block)
        }}
      >
        <slot name="custom-actions" />
        {#if !showTestStatus}
          {#if actionStepId && !isLooped && !isBranch && (block.features?.[AutomationFeature.LOOPING] || !block.features)}
            <AbsTooltip type={TooltipType.Info} text="Add looping">
              <Icon on:click={addLooping} hoverable name="arrow-clockwise" />
            </AbsTooltip>
          {/if}
          {#if !isHeaderTrigger}
            <AbsTooltip type={TooltipType.Negative} text="Delete step">
              <Icon on:click={deleteStep} hoverable name="trash" />
            </AbsTooltip>
          {/if}
        {/if}
        {#if !showTestStatus && !isHeaderTrigger}
          <span class="action-spacer"></span>
        {/if}
        {#if !showTestStatus}
          <Icon
            on:click={e => {
              e.stopPropagation()
              dispatch("toggle")
            }}
            hoverable
            name={open ? "ChevronUp" : "ChevronDown"}
          />
        {/if}
      </div>
      {#if automationNameError && editing}
        <div class="error-container">
          <AbsTooltip type={TooltipType.Negative} text={automationNameError}>
            <div class="error-icon">
              <Icon size="S" name="warning" />
            </div>
          </AbsTooltip>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .action-spacer {
    border-left: 1px solid var(--spectrum-global-color-gray-300);
  }
  .status-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    /* You can also add padding or margin to adjust the spacing between the text and the chevron if needed. */
  }

  .context-actions {
    display: flex;
    gap: var(--spacing-l);
    margin-bottom: var(--spacing-xs);
  }
  .center-items {
    display: flex;
    align-items: center;
  }
  .external-icon {
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: 0.5px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--spectrum-global-color-gray-100);
  }

  .external-icon img {
    width: 28px;
    height: 28px;
  }

  .splitHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iconAlign {
    padding: 0 0 0 var(--spacing-m);
    display: inline-block;
  }

  .blockSection {
    padding: var(--spacing-xl);
    border: 1px solid transparent;
  }

  .blockTitle {
    display: flex;
  }

  .hide-context-actions {
    display: none;
  }
  input {
    color: var(--ink);
    background-color: transparent;
    border: 1px solid transparent;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
  }

  .input-text {
    font-size: var(--spectrum-alias-font-size-default);
    font-family: var(--font-sans);
    text-overflow: ellipsis;
    padding-left: 0px;
    border: 0px;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
  }

  input:focus {
    outline: none;
  }

  /* Hide arrows for number fields */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .typing {
    border: 1px solid var(--spectrum-global-color-static-blue-500);
    border-radius: 4px 4px 4px 4px;
  }

  .typing-error {
    border: 1px solid var(--spectrum-global-color-static-red-500);
    border-radius: 4px 4px 4px 4px;
  }

  .error-icon :global(i) {
    fill: var(--spectrum-global-color-red-400);
  }

  .error-container {
    padding-top: var(--spacing-xl);
  }
</style>
