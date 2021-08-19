<script>
  import { getContext, setContext } from "svelte"
  import Placeholder from "../Placeholder.svelte"

  export let step

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")
  const formContext = getContext("form")

  // Set form step context so fields know what step they are within
  setContext("form-step", step || 1)

  $: formState = formContext?.formState
  $: currentStep = $formState?.currentStep

  // If in the builder preview, show this step if it is selected
  $: {
    if (step && formContext && $builderStore.inBuilder) {
      console.log($builderStore.selectedPath)
      console.log($component.id)

      if ($builderStore.selectedComponentPath?.includes($component.id)) {
        console.log("selecting " + step)
        formContext.formApi.setStep(step)
      }
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
