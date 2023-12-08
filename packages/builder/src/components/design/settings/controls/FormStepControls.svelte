<script>
  import { createEventDispatcher, getContext } from "svelte"
  import { ActionButton } from "@budibase/bbui"

  const multiStepStore = getContext("multi-step-form-block")
  const dispatch = createEventDispatcher()

  $: ({ stepCount, currentStep } = $multiStepStore)

  const stepAction = action => {
    dispatch("change", {
      action,
    })
  }
</script>

{#if stepCount === 1}
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
      disabled={currentStep === stepCount - 1}
      icon="ChevronRight"
      on:click={() => {
        stepAction("nextStep")
      }}
    />
    <ActionButton
      size="S"
      secondary
      icon="Close"
      disabled={stepCount === 1}
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
