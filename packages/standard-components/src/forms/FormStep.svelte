<script>
  import { getContext, setContext } from "svelte"
  import Placeholder from "../Placeholder.svelte"

  export let step = 1

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")
  const formContext = getContext("form")

  // Set form step context so fields know what step they are within
  setContext("form-step", step || 1)

  $: formState = formContext?.formState
  $: currentStep = $formState?.currentStep

  // If in the builder preview, show this step if a child is selected
  $: {
    if (
      formContext &&
      $builderStore.inBuilder &&
      $builderStore.selectedComponentPath?.includes($component.id) &&
      $formState?.currentStep !== step
    ) {
      formContext.formApi.setStep(step)
    }
  }
</script>

{#if !formContext}
  <Placeholder text="Form steps need to be wrapped in a form" />
{:else if step === currentStep}
  <div use:styleable={$component.styles}>
    <slot />
  </div>
{/if}
