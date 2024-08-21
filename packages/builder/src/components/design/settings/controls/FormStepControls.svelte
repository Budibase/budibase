<script>
  import { createEventDispatcher, getContext } from "svelte"
  import { ActionButton, AbsTooltip } from "@budibase/bbui"

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
      Add step
    </ActionButton>
  </div>
{:else}
  <div class="step-actions">
    <AbsTooltip text="Previous step" noWrap>
      <ActionButton
        size="S"
        secondary
        icon="ChevronLeft"
        disabled={currentStep === 0}
        on:click={() => {
          stepAction("previousStep")
        }}
      />
    </AbsTooltip>
    <AbsTooltip text="Next step" noWrap>
      <ActionButton
        size="S"
        secondary
        disabled={currentStep === stepCount - 1}
        icon="ChevronRight"
        on:click={() => {
          stepAction("nextStep")
        }}
      />
    </AbsTooltip>
    <AbsTooltip text="Remove step" noWrap>
      <ActionButton
        size="S"
        secondary
        icon="Close"
        disabled={stepCount === 1}
        on:click={() => {
          stepAction("removeStep")
        }}
      />
    </AbsTooltip>
    <AbsTooltip text="Add step" noWrap>
      <ActionButton
        size="S"
        secondary
        icon="MultipleAdd"
        on:click={() => {
          stepAction("addStep")
        }}
      />
    </AbsTooltip>
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
