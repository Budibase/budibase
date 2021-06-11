<script>
  import { getContext } from "svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let text

  $: placeholder = $builderStore.inBuilder && !text
  $: componentText = $builderStore.inBuilder
    ? text || "Placeholder text"
    : text || ""
</script>

<p use:styleable={$component.styles} class:placeholder>
  {componentText}
</p>

<style>
  p {
    display: inline-block;
    white-space: pre-wrap;
  }

  .placeholder {
    font-style: italic;
    color: var(--grey-6);
  }
</style>
