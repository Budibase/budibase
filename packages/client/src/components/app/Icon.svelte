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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if icon}
  <i
    use:styleable={styles}
    class="{icon} {size}"
    on:click={onClick}
    class:hoverable={onClick != null}
  />
{:else if $builderStore.inBuilder}
  <div use:styleable={styles}>
    <Placeholder />
  </div>
{/if}

<style>
  @media (hover: hover) {
    .hoverable:hover {
      color: var(--spectrum-alias-icon-color-selected-hover) !important;
      cursor: pointer;
    }
  }
  .hoverable:active {
    color: var(--spectrum-alias-icon-color-selected-hover) !important;
  }
</style>
