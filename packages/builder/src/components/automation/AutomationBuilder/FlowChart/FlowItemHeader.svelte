<script>
  import { automationStore, selectedAutomation } from "builderStore"
  import { Icon, Body, StatusLight, AbsTooltip } from "@budibase/bbui"
  import { externalActions } from "./ExternalActions"
  import { createEventDispatcher } from "svelte"
  import { Features } from "constants/backend/automations"

  export let block
  export let open
  export let showTestStatus = false
  export let testResult
  export let isTrigger
  export let idx
  export let addLooping
  export let deleteStep

  let validRegex = /^[A-Za-z0-9_\s]+$/
  let typing = false

  const dispatch = createEventDispatcher()

  $: stepNames = $selectedAutomation.definition.stepNames
  $: automationName = stepNames[block.id] || block.name || ""
  $: automationNameError = getAutomationNameError(automationName)
  $: status = updateStatus(testResult, isTrigger)
  $: isTrigger = isTrigger || block.type === "TRIGGER"
  $: {
    if (!testResult) {
      testResult = $automationStore.testResults?.steps?.filter(step =>
        block.id ? step.id === block.id : step.stepId === block.stepId
      )?.[0]
    }
  }
  $: loopBlock = $selectedAutomation?.definition.steps.find(
    x => x.blockToLoop === block.id
  )

  async function onSelect(block) {
    await automationStore.update(state => {
      state.selectedBlock = block
      return state
    })
  }

  function updateStatus(results, isTrigger) {
    if (!results) {
      return {}
    }
    const lcStatus = results.outputs?.status?.toLowerCase()
    if (lcStatus === "stopped" || lcStatus === "stopped_error") {
      return { yellow: true, message: "Stopped" }
    } else if (results.outputs?.success || isTrigger) {
      return { positive: true, message: "Success" }
    } else {
      return { negative: true, message: "Error" }
    }
  }

  const getAutomationNameError = name => {
    if (name.length > 0) {
      let invalidRoleName = !validRegex.test(name)
      if (invalidRoleName) {
        return "Please enter a role name consisting of only alphanumeric symbols and underscores"
      }
    }
    return null
  }

  const startTyping = async () => {
    typing = true
  }

  const saveName = async () => {
    if (automationNameError) {
      return
    }

    if (automationName.length === 0) {
      automationStore.actions.deleteAutomationName(block.id)
    } else {
      automationStore.actions.saveAutomationName(block.id, automationName)
    }
  }
</script>

<div
  class:typing={typing && !automationNameError}
  class:typing-error={automationNameError}
  class="blockSection"
>
  <div class="splitHeader">
    <div class="center-items">
      {#if externalActions[block.stepId]}
        <img
          alt={externalActions[block.stepId].name}
          width="28px"
          height="28px"
          src={externalActions[block.stepId].icon}
        />
      {:else}
        <svg
          width="28px"
          height="28px"
          class="spectrum-Icon"
          style="color:var(--spectrum-global-color-gray-700);"
          focusable="false"
        >
          <use xlink:href="#spectrum-icon-18-{block.icon}" />
        </svg>
      {/if}
      <div class="iconAlign">
        {#if isTrigger}
          <Body size="XS"><b>Trigger</b></Body>
        {:else}
          <Body size="XS"><b>Step {idx}</b></Body>
        {/if}
        <input
          placeholder="Enter some text"
          name="name"
          value={automationName}
          on:input={e => {
            automationNameError = getAutomationNameError(e.target.value)
            automationName = e.target.value
            if (!automationNameError) {
              automationNameError = false // Reset the error when input is valid
            }
          }}
          on:click={startTyping}
          on:blur={async () => {
            typing = false
            if (automationNameError) {
              automationName = stepNames[block.id]
              automationNameError = null
            } else {
              await saveName()
            }
          }}
        />
      </div>
    </div>
    <div class="blockTitle">
      {#if showTestStatus && testResult}
        <div style="float: right;">
          <StatusLight
            positive={status?.positive}
            yellow={status?.yellow}
            negative={status?.negative}
            ><Body size="XS">{status?.message}</Body></StatusLight
          >
        </div>
      {/if}
      <div
        class="context-actions"
        class:hide-context-actions={typing}
        on:click={() => {
          onSelect(block)
        }}
      >
        {#if !showTestStatus}
          {#if !isTrigger && !loopBlock && (block?.features?.[Features.LOOPING] || !block.features)}
            <AbsTooltip type="info" text="Add looping">
              <Icon on:click={addLooping} hoverable name="RotateCW" />
            </AbsTooltip>
          {/if}
          <AbsTooltip type="negative" text="Delete step">
            <Icon on:click={deleteStep} hoverable name="DeleteOutline" />
          </AbsTooltip>
        {/if}
        <Icon
          on:click={() => dispatch("toggle")}
          hoverable
          name={open ? "ChevronUp" : "ChevronDown"}
        />
      </div>
      {#if automationNameError}
        <div class="error-container">
          <AbsTooltip type="negative" text={automationNameError}>
            <div class="error-icon">
              <Icon size="S" name="Alert" />
            </div>
          </AbsTooltip>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .context-actions {
    display: flex;
    gap: var(--spacing-l);
    margin-left: 10px;
    margin-bottom: var(--spacing-xs);
  }
  .center-items {
    display: flex;
    align-items: center;
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
  }

  .blockTitle {
    display: flex;
    align-items: center;
  }

  .hide-context-actions {
    display: none;
  }
  input {
    font-family: var(--font-sans);
    color: var(--ink);
    background-color: transparent;
    border: none;
    font-size: var(--spectrum-alias-font-size-default);
    width: 260px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    border: 0.5px solid var(--spectrum-global-color-static-blue-500);
  }

  .typing-error {
    border: 0.5px solid var(--spectrum-global-color-static-red-500);
  }

  .error-icon :global(.spectrum-Icon) {
    fill: var(--spectrum-global-color-red-400);
  }

  .error-container {
    padding-top: var(--spacing-xl);
  }
</style>
