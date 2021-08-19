<script>
  import { getContext, setContext } from "svelte"
  import Placeholder from "../Placeholder.svelte"

  export let step

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  const formContext = getContext("form")

  // Set form step context so fields know what step they are within
  setContext("form-step", step || 1)

  $: formState = formContext?.formState
  $: currentStep = $formState?.currentStep
</script>

{#if !formContext}
  <Placeholder text="Form steps need to be wrapped in a form" />
{:else if step === currentStep}
  <div use:styleable={$component.styles}>
    <slot />
  </div>
{/if}
