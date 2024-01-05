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
  <div class="stretch">
    <ActionButton
      icon="MultipleAdd"
      secondary
      on:click={() => {
        stepAction("addStep")
      }}
    >
      Add Step
    </ActionButton>
  </div>
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
      tooltip={"Previous step"}
    />
    <ActionButton
      size="S"
      secondary
      disabled={currentStep === stepCount - 1}
      icon="ChevronRight"
      on:click={() => {
        stepAction("nextStep")
      }}
      tooltip={"Next step"}
    />
    <ActionButton
      size="S"
      secondary
      icon="Close"
      disabled={stepCount === 1}
      on:click={() => {
        stepAction("removeStep")
      }}
      tooltip={"Remove step"}
    />
    <ActionButton
      size="S"
      secondary
      icon="MultipleAdd"
      on:click={() => {
        stepAction("addStep")
      }}
      tooltip={"Add step"}
    />
  </div>
{/if}

<style>
  .stretch :global(.spectrum-ActionButton) {
    width: 100%;
  }
  .step-actions {
    display: flex;
    gap: var(--spacing-s);
  }
  .step-actions :global(.spectrum-ActionButton) {
    height: 32px;
  }
</style>
