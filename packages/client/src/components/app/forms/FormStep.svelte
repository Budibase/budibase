<script>
  import { getContext, setContext } from "svelte"
  import { writable } from "svelte/store"
  import Placeholder from "../Placeholder.svelte"

  export let step = 1

  const { styleable, builderStore, componentStore } = getContext("sdk")
  const component = getContext("component")
  const formContext = getContext("form")

  // Set form step context so fields know what step they are within
  const stepStore = writable(step || 1)
  $: stepStore.set(step || 1)
  setContext("form-step", stepStore)

  $: formState = formContext?.formState
  $: currentStep = $formState?.currentStep

  // If in the builder preview, show this step if a child is selected
  $: {
    if (
      formContext &&
      $builderStore.inBuilder &&
      $componentStore.selectedComponentPath?.includes($component.id)
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
