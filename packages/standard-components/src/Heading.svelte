<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let type
  export let text = ""
</script>

{#if type === 'h1'}
  <h1 use:styleable={$component.styles}>{text}</h1>
{:else if type === 'h2'}
  <h2 use:styleable={$component.styles}>{text}</h2>
{:else if type === 'h3'}
  <h3 use:styleable={$component.styles}>{text}</h3>
{:else if type === 'h4'}
  <h4 use:styleable={$component.styles}>{text}</h4>
{:else if type === 'h5'}
  <h5 use:styleable={$component.styles}>{text}</h5>
{:else if type === 'h6'}
  <h6 use:styleable={$component.styles}>{text}</h6>
{/if}

<style>
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0.5em 0;
    white-space: pre-wrap;
  }
</style>
