<script lang="ts">
  import { Icon, TooltipPosition } from "@budibase/bbui"
  import {
    type AutomationStep,
    type AutomationTrigger,
    type Automation,
    AutomationStepType,
    isActionStep,
  } from "@budibase/types"
  import {
    type ExternalAction,
    externalActions,
  } from "@/components/automation/AutomationBuilder/FlowChart/ExternalActions"
  import { createEventDispatcher } from "svelte"

  export let block: AutomationStep | AutomationTrigger | undefined = undefined
  export let automation: Automation | undefined = undefined
  export let itemName: string | undefined = undefined
  export let disabled: boolean = false
  export let compact: boolean = false

  const dispatch = createEventDispatcher()

  let externalAction: ExternalAction | undefined
  let editing: boolean
  let validRegex: RegExp = /^[A-Za-z0-9_\s]+$/

  $: stepNames = automation?.definition.stepNames || {}
  $: blockHeading = getHeading(itemName, block) || ""
  $: blockNameError = getStepNameError(blockHeading)

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

  // Put the type in the header if they change the name
  // Otherwise the info is obscured

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

<div class="block-details" class:compact>
  {#if block}
    {#if externalAction}
      <div class="external-icon" class:compact>
        <img alt={externalAction.name} src={externalAction.icon} />
      </div>
    {:else}
      <div class="icon-container" class:compact>
        <Icon
          name={block.icon}
          size="M"
          color="var(--spectrum-global-color-static-gray-50)"
        />
      </div>
    {/if}
    <div class="heading" class:compact>
      {#if compact}
        <div class="input-text compact-label">
          {blockHeading}
        </div>
      {:else}
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
      {/if}
    </div>
  {/if}
  {#if blockNameError && editing}
    <div class="error-container">
      <div class="error-icon">
        <Icon
          size="S"
          name="warning"
          tooltip={blockNameError}
          tooltipPosition={TooltipPosition.Left}
          color="var(--spectrum-global-color-static-gray-50)"
        />
      </div>
    </div>
  {/if}
</div>

<style>
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
    font-size: var(--spectrum-global-dimension-font-size-150);
    font-family: var(--font-sans);
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
    text-overflow: ellipsis;
    padding-left: 0px;
    border: 0px;
    line-height: 0;
  }

  .compact-label {
    position: absolute;
    top: calc(50% - 0.6em - 2px);
    left: 0;
    display: -webkit-box;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    overflow: hidden;
    text-align: left;
    white-space: normal;
    overflow-wrap: anywhere;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.3;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
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
    gap: var(--spacing-m);
    flex: 1 1 0;
    min-width: 0;
  }

  .block-details.compact {
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    flex: 0 0 100%;
    gap: 0;
    height: 100%;
    padding: 18px;
    box-sizing: border-box;
  }

  .error-icon :global(i) {
    fill: var(--spectrum-global-color-red-600);
  }

  .heading {
    flex: 1;
  }

  .heading.compact {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
  }

  .icon-container {
    background-color: #215f9e;
    border: 0.5px solid #467db4;
    padding: 4px;
    border-radius: 8px;
  }

  .external-icon img {
    width: 24px;
    height: 24px;
  }

  .icon-container.compact,
  .external-icon.compact {
    position: absolute;
    top: 14px;
    left: 18px;
    width: 26px;
    height: 26px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 8px;
  }

  .icon-container.compact :global(svg) {
    width: 18px;
    height: 18px;
  }

  .external-icon.compact img {
    width: 18px;
    height: 18px;
  }
</style>
