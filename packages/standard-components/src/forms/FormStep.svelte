<script>
  import { getContext } from "svelte"
  import Placeholder from "../Placeholder.svelte"

  export let step

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  const formContext = getContext("form")

  $: formState = formContext?.formState
</script>

{#if !formContext}
  <Placeholder text="Form steps need to be wrapped in a form" />
{:else if step === $formState.step}
  <div use:styleable={$component.styles}>
    <div>
      Step {step} is visible!
    </div>
    <slot />
  </div>
{:else}
  <div>hiding step {step}!</div>
{/if}
