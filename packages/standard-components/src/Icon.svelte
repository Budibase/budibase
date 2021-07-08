<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let icon
  export let size
  export let color
  export let onClick

  $: styles = {
    ...$component.styles,
    normal: {
      ...$component.styles.normal,
      color: color || "var(--spectrum-global-color-gray-900)",
    },
  }
</script>

{#if icon}
  <i use:styleable={styles} class="{icon} {size}" on:click={onClick} />
{:else if $builderStore.inBuilder}
  <div use:styleable={styles}>
    <Placeholder />
  </div>
{/if}

<style>
  div {
    font-style: italic;
  }
</style>
