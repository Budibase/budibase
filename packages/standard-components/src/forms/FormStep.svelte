<script>
  import { getContext } from "svelte"
  import Placeholder from "../Placeholder.svelte"

  export let step

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  const formContext = getContext("form")
</script>

{#if !formContext}
  <Placeholder text="Form steps need to be wrapped in a form" />
{:else}
  <div use:styleable={$component.styles}>
    <slot />
  </div>
{/if}
