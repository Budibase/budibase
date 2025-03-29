<script lang="ts">
  import { Body, Tags, Tag, Icon, TooltipPosition } from "@budibase/bbui"
  import {
    type AutomationStep,
    type AutomationTrigger,
    type Automation,
    AutomationStepType,
    isBranchStep,
    isActionStep,
  } from "@budibase/types"
  import {
    type ExternalAction,
    externalActions,
  } from "@/components/automation/AutomationBuilder/FlowChart/ExternalActions"
  import { automationStore } from "@/stores/builder"
  import { createEventDispatcher } from "svelte"

  export let block: AutomationStep | AutomationTrigger | undefined = undefined
  export let automation: Automation | undefined = undefined
  export let itemName: string | undefined = undefined
  export let disabled: boolean = false

  const dispatch = createEventDispatcher()

  let externalAction: ExternalAction | undefined
  let editing: boolean
  let validRegex: RegExp = /^[A-Za-z0-9_\s]+$/

  $: stepNames = automation?.definition.stepNames || {}
  $: blockHeading = getHeading(itemName, block) || ""
  $: blockNameError = getStepNameError(blockHeading)
  $: isBranch = block && isBranchStep(block)

  const getHeading = (
    itemName?: string,
    block?: AutomationStep | AutomationTrigger
  ) => {
    if (itemName) {
      return itemName
    } else if (block) {
      return stepNames?.[block?.id] || block?.name
    }
  }

  $: isTrigger = block?.type === AutomationStepType.TRIGGER
  $: allSteps = automation?.definition.steps || []
  $: blockDefinition = automationStore.actions.getBlockDefinition(block)

  // Put the type in the header if they change the name
  // Otherwise the info is obscured
  $: blockTitle = isBranch
    ? "Branch"
    : `${
        block &&
        block?.id in stepNames &&
        stepNames[block?.id] !== blockDefinition?.name
          ? blockDefinition?.name
          : "Step"
      }`

  // Parse external actions
  $: if (block && isActionStep(block) && block?.stepId in externalActions) {
    externalAction = externalActions[block?.stepId]
  } else {
    externalAction = undefined
  }

  const getStepNameError = (name: string) => {
    if (!block) {
      return
    }
    const duplicateError =
      "This name already exists, please enter a unique name"
    if (editing) {
      for (const [key, value] of Object.entries(stepNames)) {
        if (name !== block.name && name === value && key !== block.id) {
          return duplicateError
        }
      }

      for (const step of allSteps) {
        if (step.id !== block.id && name === step.name) {
          return duplicateError
        }
      }
    }

    if (name !== block.name && name?.length > 0) {
      let invalidRoleName = !validRegex.test(name)
      if (invalidRoleName) {
        return "Please enter a name consisting of only alphanumeric symbols and underscores"
      }
    }
  }

  const startEditing = () => {
    editing = true
  }

  const stopEditing = () => {
    editing = false
    if (blockNameError) {
      blockHeading =
        (block ? stepNames[block?.id] : undefined) || block?.name || ""
    } else {
      dispatch("update", blockHeading)
    }
  }

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    blockHeading = target.value.trim()
  }
</script>

<div class="block-details">
  {#if block}
    {#if externalAction}
      <img
        alt={externalAction.name}
        src={externalAction.icon}
        width="28px"
        height="28px"
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
    <div class="heading">
      {#if isTrigger}
        <Body size="XS"><b>Trigger</b></Body>
      {:else}
        <Body size="XS">
          <div class="step">
            <b>{blockTitle}</b>
            {#if blockDefinition?.deprecated}
              <Tags>
                <Tag invalid>Deprecated</Tag>
              </Tags>
            {/if}
          </div>
        </Body>
      {/if}
      <input
        class="input-text"
        placeholder={`Enter step name`}
        name="name"
        autocomplete="off"
        disabled={isTrigger || disabled}
        value={blockHeading}
        on:input={handleInput}
        on:click={e => {
          e.stopPropagation()
          startEditing()
        }}
        on:keydown={async e => {
          if (e.key === "Enter") {
            stopEditing()
          }
        }}
        on:blur={stopEditing}
      />
    </div>
  {/if}
  {#if blockNameError && editing}
    <div class="error-container">
      <div class="error-icon">
        <Icon
          size="S"
          name="Alert"
          tooltip={blockNameError}
          tooltipPosition={TooltipPosition.Left}
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .step {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  input {
    color: var(--ink);
    background-color: transparent;
    border: 1px solid transparent;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }

  .input-text {
    font-size: var(--spectrum-alias-font-size-default);
    font-family: var(--font-sans);
    text-overflow: ellipsis;
    padding-left: 0px;
    border: 0px;
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

  .block-details {
    display: flex;
    align-items: center;
    gap: var(--spacing-l);
    flex: 1 1 0;
    min-width: 0;
  }

  .error-icon :global(.spectrum-Icon) {
    fill: var(--spectrum-global-color-red-600);
  }

  .heading {
    flex: 1;
  }
</style>
