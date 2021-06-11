<script>
  import { getContext } from "svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let type
  export let text

  $: placeholder = $builderStore.inBuilder && !text
  $: componentText = $builderStore.inBuilder
    ? text || "Placeholder text"
    : text || ""
</script>

{#if type === "h1"}
  <h1 class:placeholder use:styleable={$component.styles}>{componentText}</h1>
{:else if type === "h2"}
  <h2 class:placeholder use:styleable={$component.styles}>{componentText}</h2>
{:else if type === "h3"}
  <h3 class:placeholder use:styleable={$component.styles}>{componentText}</h3>
{:else if type === "h4"}
  <h4 class:placeholder use:styleable={$component.styles}>{componentText}</h4>
{:else if type === "h5"}
  <h5 class:placeholder use:styleable={$component.styles}>{componentText}</h5>
{:else if type === "h6"}
  <h6 class:placeholder use:styleable={$component.styles}>{componentText}</h6>
{/if}

<style>
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    white-space: pre-wrap;
  }

  .placeholder {
    font-style: italic;
    color: var(--grey-6);
  }
</style>
