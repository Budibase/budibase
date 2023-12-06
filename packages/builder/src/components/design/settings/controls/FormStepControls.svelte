<script>
  import { createEventDispatcher, getContext } from "svelte"
  import { ActionButton } from "@budibase/bbui"

  const stepState = getContext("step-form-block")
  const dispatch = createEventDispatcher()

  $: ({ stepsCount, currentStep } = $stepState)

  const parseLastIdx = stepsCount => {
    return Math.max(stepsCount - 1, 0)
  }
  $: lastIdx = parseLastIdx(stepsCount)

  const stepAction = action => {
    dispatch("change", {
      action,
    })
  }
</script>

{#if stepsCount === 1}
  <ActionButton
    icon="MultipleAdd"
    secondary
    on:click={() => {
      stepAction("addStep")
    }}
  >
    Add Step
  </ActionButton>
{:else}
  <div class="step-actions">
    <ActionButton
      size="S"
      secondary
      icon="ChevronLeft"
      disabled={currentStep === 0}
      on:click={() => {
        stepAction("previousStep")
      }}
    />
    <ActionButton
      size="S"
      secondary
      disabled={currentStep === lastIdx}
      icon="ChevronRight"
      on:click={() => {
        stepAction("nextStep")
      }}
    />
    <ActionButton
      size="S"
      secondary
      icon="Close"
      disabled={stepsCount === 1}
      on:click={() => {
        stepAction("removeStep")
      }}
    />
    <ActionButton
      size="S"
      secondary
      icon="MultipleAdd"
      on:click={() => {
        stepAction("addStep")
      }}
    />
  </div>
{/if}

<style>
  .step-actions {
    display: flex;
    gap: var(--spacing-s);
  }

  .step-actions :global(.spectrum-ActionButton) {
    height: 32px;
  }
</style>
